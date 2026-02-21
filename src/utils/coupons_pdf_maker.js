// src/utils/coupons_pdf_maker.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";
import QRCode from "qrcode";

export async function coupons_pdf_maker(coupon) {
    // logo del sitio 
    const logoUrl = "/logo_mundo_cupones.png";

    // sitio para canjear codigo 
    const redeemBase = import.meta.env.VITE_REDEEM_BASE_URL || window.location.origin;
    // link que abrirá el QR
    const redeemUrl = `${redeemBase}/redeem?code=${encodeURIComponent(
        coupon.code
    )}`;

    // usuario 
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    const user = authData?.user;
    if (authErr || !user) {
        throw new Error("No autenticado: no se puede generar el PDF.");
    }

    let fullName = null;
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("first_names, last_names")
            .eq("user_id", user.id)
            .single();

        fullName = profile ? `${profile.first_names} ${profile.last_names}` : null;
    } catch (e) {
        console.log("No se pudo obtener el perfil del usuario para el PDF:", e);
    }

    // Helpers
    const safe = (v, fallback = "—") => (v == null || v === "" ? fallback : String(v));
    const fmtDate = (v) => {
        if (!v) return "—";
        return String(v).slice(0, 10);
    };

    const wrapText = (text, maxWidth, font, size) => {
        const words = String(text ?? "").split(/\s+/);
        const lines = [];
        let line = "";

        for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            const width = font.widthOfTextAtSize(test, size);
            if (width <= maxWidth) line = test;
            else {
                if (line) lines.push(line);
                line = w;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    // Crear PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Cargar logo
    let logoImg = null;
    try {
        const logoBytes = await fetch(logoUrl).then((r) => r.arrayBuffer());
        logoImg = await pdfDoc.embedPng(logoBytes);
    } catch (_) {
        // si no 
        console.log("No se pudo cargar el logo para el PDF, se omitirá.");
    }

    const qrDataUrl = await QRCode.toDataURL(redeemUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 320,
    });
    const qrBytes = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
    const qrImg = await pdfDoc.embedPng(qrBytes);



    // Layout
    const margin = 48;
    let y = height - margin;

    // Header
    const headerH = 80;
    page.drawRectangle({
        x: 0,
        y: height - headerH,
        width,
        height: headerH,
        color: rgb(0.06, 0.06, 0.06),
    });

    if (logoImg) {
        const imgW = 44;
        const imgH = 44;
        page.drawImage(logoImg, {
            x: margin,
            y: height - headerH / 2 - imgH / 2,
            width: imgW,
            height: imgH,
        });
    }

    page.drawText("Mundo Cupones", {
        x: logoImg ? margin + 56 : margin,
        y: height - 52,
        size: 22,
        font: fontBold,
        color: rgb(1, 1, 1),
    });

    page.drawText("Cupón digital", {
        x: logoImg ? margin + 56 : margin,
        y: height - 74,
        size: 11,
        font: fontRegular,
        color: rgb(0.85, 0.85, 0.85),
    });

    // Body start
    y = height - headerH - 30;

    // Título oferta
    page.drawText(safe(coupon.offerName, "Cupón"), {
        x: margin,
        y,
        size: 16,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
    });
    y -= 18;

    page.drawText(`Negocio: ${safe(coupon.businessName)}`, {
        x: margin,
        y,
        size: 11,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
    });
    y -= 22;

    // Código grande
    const code = safe(coupon.code);
    page.drawText("CÓDIGO", {
        x: margin,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.35, 0.35, 0.35),
    });
    y -= 16;

    // CODIGO EN TEXTO GRANDE 
    page.drawRectangle({
        x: margin,
        y: y - 36,
        width: width - margin * 2,
        height: 46,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
    });

    page.drawText(code, {
        x: margin + 16,
        y: y - 22,
        size: 20,
        font: fontBold,
        color: rgb(0.05, 0.05, 0.05),
    });

    y -= 60;

     // CODIGO en LINK
    page.drawRectangle({
        x: margin,
        y: y - 36,
        width: width - margin * 2,
        height: 46,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
    });

    page.drawText(safe(redeemUrl), {
        x: margin + 16,
        y: y - 22,
        size: 16,
        font: fontBold,
        color: rgb(0.05, 0.05, 0.05),
    });

    y -= 60;

    // QR CODE 
    // dibujar en la página con el QR code
    const qrSize = 110;
    // Bloque info
    const boxX = margin;
    const boxW = width - margin * 2;
    const boxH = 150;
    page.drawRectangle({
        x: boxX,
        y: y - boxH,
        width: boxW,
        height: boxH,
        borderColor: rgb(0.88, 0.88, 0.88),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
    });

    // QR dentro del box (derecha)
    const qrX = boxX + boxW - qrSize - 14;
    const qrY = y - 22 - qrSize + 8;

    page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });
    page.drawText("Escaneá para canjear", {
        x: qrX - 18,
        y: qrY - 14,
        size: 9,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
    });

    // texto lado izquierdo
    const leftX = boxX + 14;
    let yy = y - 22;

    const userLine1 = fullName
        ? `Solicitado por: ${fullName}`
        : `Solicitado por: ${safe(user.email)}`;

    const rows = [
        userLine1,
        `Estado: ${safe(coupon.status)}`,
        `Fecha de compra: ${fmtDate(coupon.purchaseDate)}`,
        `Válido desde: ${fmtDate(coupon.validFrom)}`,
        `Válido hasta: ${fmtDate(coupon.validUntil)}`,
    ];

    for (const r of rows) {
        page.drawText(r, {
            x: leftX,
            y: yy,
            size: 10.5,
            font: fontRegular,
            color: rgb(0.18, 0.18, 0.18),
        });
        yy -= 16;
    }

    y -= boxH + 30;

    // Nota / detalles
    page.drawText("Detalles", {
        x: margin,
        y,
        size: 12,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;

    const detailsText =
        `Este cupón es válido únicamente en el negocio indicado. ` +
        `Presentá este PDF o el código al momento de canjear.`;

    const lines = wrapText(detailsText, width - margin * 2, fontRegular, 10.5);
    for (const line of lines) {
        page.drawText(line, {
            x: margin,
            y,
            size: 10.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        });
        y -= 14;
    }

    // Footer
    const footer = `Generado: ${fmtDate(new Date().toISOString())} - Mundo Cupones`;
    page.drawText(footer, {
        x: margin,
        y: 30,
        size: 9,
        font: fontRegular,
        color: rgb(0.45, 0.45, 0.45),
    });

    //  Descargar
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `cupon_${coupon.purchaseDate}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}