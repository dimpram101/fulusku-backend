import { MutationType, PaymentMemberRole, PaymentStatus } from "@prisma/client";
import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { formatIDR } from "../../utils/currency";
import { randomAmount, randomPaymentId } from "../../utils/generator";
import { validate } from "../../validations";
import {
  CreateDummyPaymentRequest,
  PaymentSoloRequest,
  PaymentWithMemberRequest,
  UpdateMemberStatusRequest
} from "./payment-model";
import { PaymentValidation } from "./payment-validation";

export class PaymentService {
  static async createDummyPayment(data: CreateDummyPaymentRequest) {
    const validatedData: CreateDummyPaymentRequest = await validate(
      PaymentValidation.CREATE_DUMMY_PAYMENT,
      data
    );

    const tomorrowDueDate = new Date();
    tomorrowDueDate.setDate(tomorrowDueDate.getDate() + 1);

    const payment = await prisma.payment.create({
      data: {
        id: randomPaymentId(),
        amount: validatedData.amount || randomAmount(),
        due_date: tomorrowDueDate
      }
    });

    return payment;
  }

  static async getUserPayments(accountId: string) {
    let payments = await prisma.payment.findMany({
      where: {
        members: {
          some: {
            account_id: accountId
          }
        }
      },
      include: {
        members: true
      },
      orderBy: {
        created_at: "desc"
      }
    });

    payments = payments.filter(payment => payment.members.length > 1);

    let canPay: boolean | null = payments.length ? true : null;

    if (payments.length) {
      canPay = payments.every(payment =>
        payment.members.every(
          member => member.status === PaymentStatus.ACCEPTED
        )
      );
    }

    return {
      payments,
      canPay
    };
  }

  static async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId
      },
      include: {
        members: {
          include: {
            account: true
          }
        }
      }
    });

    let canPay: boolean | null = payment ? true : null;
    if (payment?.members.length) {
      canPay = payment.members.every(
        member => member.status === PaymentStatus.ACCEPTED
      );
    }
    const payload = {
      payment,
      canPay
    };

    return payload;
  }

  static async paymentSolo(data: PaymentSoloRequest) {
    const validatedData: PaymentSoloRequest = await validate(
      PaymentValidation.PAYMENT_SOLO,
      data
    );

    const payment = await prisma.payment.findUnique({
      where: {
        id: validatedData.payment_id
      }
    });

    if (!payment) {
      throw new ErrorResponse("Payment not found", 404, ["payment_id"]);
    }

    await prisma.$transaction(async prisma => {
      await prisma.account.update({
        where: {
          id: validatedData.account_id
        },
        data: {
          balance: {
            decrement: payment.amount
          }
        }
      });

      await prisma.payment.update({
        where: {
          id: validatedData.payment_id
        },
        data: {
          status: PaymentStatus.PAID
        }
      });

      await prisma.paymentMember.create({
        data: {
          account_id: validatedData.account_id,
          payment_id: validatedData.payment_id,
          status: PaymentStatus.PAID,
          amount: payment.amount,
          role: PaymentMemberRole.INITIATOR
        }
      });

      await prisma.mutation.create({
        data: {
          account_id: validatedData.account_id,
          type: MutationType.OUT,
          amount: payment.amount,
          description:
            "Payment to " +
            payment.id +
            " with amount " +
            formatIDR(payment.amount)
        }
      });
    });
  }

  static async createPaymentWithMember(data: PaymentWithMemberRequest) {
    const validatedData: PaymentWithMemberRequest = await validate(
      PaymentValidation.PAYMENT_WITH_MEMBER,
      data
    );

    const payment = await prisma.payment.findUnique({
      where: {
        id: validatedData.payment_id
      }
    });

    if (!payment) {
      throw new ErrorResponse("Payment not found", 404, ["payment_id"]);
    }

    const result = await prisma.$transaction(async prisma => {
      let totalAmount = 0;
      if (validatedData.evenly) {
        totalAmount = payment.amount / validatedData.members.length;
      }

      const members = await prisma.paymentMember.createMany({
        data: validatedData.members.map(member => ({
          payment_id: validatedData.payment_id,
          account_id: member.account_id,
          status:
            member.role === PaymentMemberRole.INITIATOR
              ? PaymentStatus.ACCEPTED
              : PaymentStatus.PENDING,
          amount: validatedData.evenly ? totalAmount : member.amount,
          role: member.role
        }))
      });

      const initiator = validatedData.members.find(
        member => member.role === PaymentMemberRole.INITIATOR
      );

      const initiatorAccount = await prisma.account.findUnique({
        where: {
          id: initiator!.account_id
        }
      });

      await prisma.notification.create({
        data: {
          title: "Payment Request",
          message: `You have a payment request from ${initiatorAccount!.full_name}`,
          send_all: false,
          receivers: {
            create: validatedData.members
              .filter(member => member.role !== PaymentMemberRole.INITIATOR)
              .map(member => ({
                account_id: member.account_id
              }))
          }
        }
      });

      return members;
    });

    return result;
  }

  static async updateMemberStatus(data: UpdateMemberStatusRequest) {
    const validatedData: UpdateMemberStatusRequest = await validate(
      PaymentValidation.UPDATE_MEMBER_STATUS,
      data
    );

    const payment = await prisma.payment.findUnique({
      where: {
        id: validatedData.payment_id
      }
    });

    if (!payment) {
      throw new ErrorResponse("Payment not found", 404, ["payment_id"]);
    }

    const paymentMember = await prisma.paymentMember.findFirst({
      where: {
        payment_id: validatedData.payment_id,
        account_id: validatedData.account_id
      }
    });

    if (!paymentMember) {
      throw new ErrorResponse("Member not found", 404, ["account_id"]);
    }

    await prisma.paymentMember.update({
      where: {
        id: paymentMember.id
      },
      data: {
        status: validatedData.status
      }
    });
  }

  static async payWithMembers(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId
      },
      include: {
        members: true
      }
    });

    if (!payment) {
      throw new ErrorResponse("Payment not found", 404, ["payment_id"]);
    } else if (payment.status === PaymentStatus.PAID) {
      throw new ErrorResponse("Payment already paid", 400, ["payment_id"]);
    } else if (!payment.members.length) {
      throw new ErrorResponse("No members found", 404, ["payment_id"]);
    }

    const isAllAccepted = payment.members.every(
      member => member.status === PaymentStatus.ACCEPTED
    );

    if (!isAllAccepted) {
      throw new ErrorResponse("Not all members accepted", 400, ["members"]);
    }

    const members = payment.members;

    await prisma.$transaction(async prisma => {
      await prisma.payment.update({
        where: {
          id: paymentId
        },
        data: {
          status: PaymentStatus.PAID,
          members: {
            updateMany: {
              where: {
                payment_id: paymentId
              },
              data: {
                status: PaymentStatus.PAID
              }
            }
          }
        }
      });

      await Promise.all(
        members.map(async member => {
          await prisma.account.update({
            where: {
              id: member.account_id
            },
            data: {
              balance: {
                decrement: member.amount
              }
            }
          });

          await prisma.mutation.create({
            data: {
              account_id: member.account_id,
              type: MutationType.OUT,
              amount: member.amount,
              description:
                "Payment to " +
                payment.id +
                " with amount " +
                formatIDR(member.amount)
            }
          });
        })
      );
    });
  }
}
