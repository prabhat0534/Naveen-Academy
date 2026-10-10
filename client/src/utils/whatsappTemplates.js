// 1. Fee Reminder Message Template
export const getFeeReminderMessage = (student) => {
  const text = `*NAVEEN ACADEMY - FEE REMINDER* 📚
--------------------------------------
Dear Parent,
Greetings from Naveen Academy.

This is a gentle reminder regarding the monthly fee for your ward:
• *Student Name:* ${student.name}
• *Class:* ${student.class || student.studentClass}
• *Roll No:* ${student.rollNo || "-"}
• *Pending Amount:* ₹${student.monthlyFee}
• *Month:* October 2026

Kindly clear the pending fee at your earliest convenience via Cash or UPI (Google Pay / PhonePe).

If you have already paid, please ignore this reminder.

_Regards,_
*Director, Naveen Academy*
📞 Contact: +91 9876543210`;

  return encodeURIComponent(text);
};

// 2. Notice / Announcement Broadcast Template
export const getNoticeBroadcastMessage = (notice) => {
  const text = `📢 *OFFICIAL NOTICE - NAVEEN ACADEMY*
--------------------------------------
*Subject:* ${notice.title}
*Target Batch:* ${notice.targetClass}
*Date:* ${notice.date}
*Priority:* ${notice.priority}

${notice.message}

--------------------------------------
For any queries, feel free to contact the academy office.

_Regards,_
*Naveen Academy Management*`;

  return encodeURIComponent(text);
};

// 3. General Direct WhatsApp Link Generator
export const generateWhatsAppLink = (mobile, message) => {
  // Mobile number clean up (remove extra spaces or dashes)
  const cleanNumber = mobile.replace(/[^0-9]/g, "");
  const formattedNumber = cleanNumber.startsWith("91") ? cleanNumber : `91${cleanNumber}`;
  return `https://wa.me/${formattedNumber}?text=${message}`;
};