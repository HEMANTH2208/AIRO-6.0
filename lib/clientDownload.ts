export function downloadQRCard(
  team: {
    registration_id: string;
    event_name: string;
    team_name: string;
    college_name: string;
    qr_code: string;
  },
  membersCount: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = 440;
  canvas.height = 620;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border glow
  ctx.strokeStyle = "#6c63ff";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Header Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AIRO 6.0", canvas.width / 2, 50);

  // Organizer info
  ctx.fillStyle = "#a0a0c0";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Sairam Engineering College", canvas.width / 2, 75);

  ctx.fillStyle = "#6c63ff";
  ctx.font = "11px sans-serif";
  ctx.fillText("Department of AI & Data Science", canvas.width / 2, 95);

  // Divider Line
  ctx.strokeStyle = "#2a2a55";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 115);
  ctx.lineTo(canvas.width - 30, 115);
  ctx.stroke();

  // Draw QR Image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    // Draw white background card for QR Code
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    const rx = canvas.width / 2 - 110;
    const ry = 140;
    const rw = 220;
    const rh = 220;
    const radius = 12;
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fill();

    // Draw QR Code image
    ctx.drawImage(img, canvas.width / 2 - 100, 150, 200, 200);

    // Registration ID Box
    ctx.fillStyle = "rgba(108, 99, 255, 0.1)";
    const bx = 40;
    const by = 385;
    const bw = canvas.width - 80;
    const bh = 45;
    const br = 6;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(108, 99, 255, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#8b84ff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(team.registration_id, canvas.width / 2, 413);

    // Info rows helper
    const drawRow = (label: string, value: string, y: number) => {
      ctx.fillStyle = "#a0a0c0";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 40, y);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "right";
      
      let displayVal = value;
      if (ctx.measureText(displayVal).width > 220) {
        while (ctx.measureText(displayVal + "...").width > 220 && displayVal.length > 0) {
          displayVal = displayVal.slice(0, -1);
        }
        displayVal += "...";
      }
      ctx.fillText(displayVal, canvas.width - 40, y);
    };

    drawRow("Event", team.event_name, 470);
    drawRow("Team Name", team.team_name, 500);
    drawRow("College", team.college_name, 530);
    drawRow("Members", `${membersCount} members`, 560);
    drawRow("Date & Day", "08.10.26 (Thursday)", 590);

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `AIRO6_Pass_${team.registration_id}.png`;
    a.click();
  };
  img.src = team.qr_code;
}
