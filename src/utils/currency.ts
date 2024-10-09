export const IDRFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
});

export const formatIDR = (value: number) => {
  return IDRFormatter.format(value).replace(/\s/g, '').replace('Rp', 'Rp.');
}