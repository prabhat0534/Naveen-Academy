# Database Design

## Admin

- id
- name
- email
- password
- phone

-----------------------------------

## Student

- studentId
- name
- fatherName
- motherName
- mobile
- parentMobile
- address
- class
- monthlyFee
- admissionDate
- password
- profilePhoto

-----------------------------------

## Fees

- feeId
- studentId
- month
- amount
- paymentStatus
- paymentDate
- receiptNumber

-----------------------------------

## Notes

- noteId
- title
- class
- pdfFile
- uploadDate

-----------------------------------

## Notices

- noticeId
- title
- description
- pdfFile
- uploadDate

-----------------------------------

## Notifications

- notificationId
- title
- message
- createdAt
