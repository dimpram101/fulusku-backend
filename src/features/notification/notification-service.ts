import prisma from "../../database";

export class NotificationService {
  static async getAllNotifications(accountId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        receivers: {
          some: {
            account_id: accountId
          }
        }
      },
      include: {
        receivers: true
      }
    });

    return notifications;
  }
}
