const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
}

async function sendJadwalEmail({ to, subjek, jadwalPertemuan, namaPeminjam, item, tipe }) {
  const from = process.env.SMTP_FROM || "sarpras@kampus.ac.id";
  const tipeLabel = { barang: "Barang", ruangan: "Ruangan", laboratorium: "Laboratorium" }[tipe] || "Sarpras";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #4f46e5;">Penjadwalan Pertemuan Peminjaman Sarpras</h2>
      <p>Yth. <strong>${namaPeminjam}</strong>,</p>
      <p>Pengajuan peminjaman <strong>${item}</strong> (${tipeLabel}) memerlukan pertemuan lanjutan dengan tim Sarpras.</p>
      <table style="margin: 16px 0; border-collapse: collapse;">
        <tr><td style="padding: 8px; color: #666;">Subjek</td><td style="padding: 8px;"><strong>${subjek}</strong></td></tr>
        <tr><td style="padding: 8px; color: #666;">Jadwal Pertemuan</td><td style="padding: 8px;"><strong>${jadwalPertemuan}</strong></td></tr>
      </table>
      <p>Harap hadir tepat waktu. Jika berhalangan, hubungi bagian Sarpras kampus.</p>
      <p style="color: #888; font-size: 12px;">Email otomatis — Sistem Layanan Sarpras</p>
    </div>
  `;

  const info = await getTransporter().sendMail({
    from,
    to,
    subject: subjek,
    html,
    text: `Penjadwalan pertemuan peminjaman ${item}. Jadwal: ${jadwalPertemuan}`,
  });

  if (!process.env.SMTP_HOST) {
    console.log("[Email Demo] Jadwal terkirim (simulasi):", JSON.stringify({ to, subjek, jadwalPertemuan }, null, 2));
    if (info.message) console.log(info.message);
  }

  return info;
}

module.exports = { sendJadwalEmail };
