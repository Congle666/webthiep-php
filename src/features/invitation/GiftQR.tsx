/** QR mừng cưới — tự sinh VietQR từ {bank, account, name}, hoặc dùng ảnh QR upload sẵn. */
import { Download } from 'lucide-react';
import type { BankInfo } from './types';

interface Props { label: string; bank: BankInfo; fallbackImg: string | null; }

/** Sinh URL ảnh VietQR (img.vietqr.io) — miễn phí, chuẩn ngành VN. */
function vietQrUrl(b: BankInfo): string | null {
  if (!b.bank || !b.account) return null;
  const name = encodeURIComponent(b.name ?? '');
  return `https://img.vietqr.io/image/${b.bank}-${b.account}-qr_only.png?accountName=${name}`;
}

export function GiftQR({ label, bank, fallbackImg }: Props) {
  const src = vietQrUrl(bank) ?? fallbackImg;
  if (!src) return null;
  return (
    <div className="inv-qr">
      <span className="inv-qr-label">{label}</span>
      <img src={src} alt={`QR ${label}`} />
      {bank.bank && <span className="inv-qr-bank">{bank.bank} · {bank.account}</span>}
      {bank.name && <span className="inv-qr-name">{bank.name}</span>}
      <a className="inv-qr-save" href={src} download target="_blank" rel="noreferrer"><Download size={13} /> Lưu QR</a>
    </div>
  );
}
