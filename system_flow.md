Full system flow (detailed note — no code)
Roles

Admin — full control
Student / Parent — portal login, view fees, pay online


Step 1 — School setup (Admin)

Admin logs in
Creates fee structure (name, class, term, amount)
Can edit or delete fee items anytime
Classes can be hardcoded first; later a Class module


Step 2 — Student registration (Admin)

Admin adds student (name, class, guardian, phone, etc.)
Student gets a unique ID (e.g. MFA-2026-001)
System links student to fees for their class + current term
Outstanding balance is calculated automatically


Step 3 — How fees work

Each fee item belongs to a class and term
Student in JSS 2 sees all JSS 2 fees for the active term
“All Classes” fees apply to everyone
Balance = sum of assigned fees − sum of payments


Step 4 — Manual payment (Admin)

Parent pays cash or transfers to school account
Admin opens Record Payment
Searches student by name or ID
Sees outstanding balance
Selects fee type, amount, method (Cash / Bank Transfer)
Saves
Payment appears in Payment Records
Student balance updates (Paid / Partial / Unpaid)


Step 5 — Online payment (Parent — later phase)

Parent logs into Student Portal
Sees outstanding fees and history
Clicks Pay Now
Pays via Paystack (card, transfer, USSD)
Paystack confirms payment (webhook)
System creates the same payment record as manual
Balance updates; parent can download receipt

Important: Online and manual payments write to the same payments table. Admin always sees everything in one place.

Step 6 — What Admin sees daily

Dashboard: total students, fees collected, pending
Students list: profiles, edit, status
Fee structure: manage prices
Payments: who paid, what, when, method
Record payment when someone pays offline


Step 7 — What Parent / Student sees (portal)

Login with student ID + password (or phone)
Dashboard: class, term, outstanding
Fees page: breakdown + Pay Now
Payment history + receipts
Profile (view / limited edit)


Data relationships (simple)
textStudent  →  belongs to Class
Fee      →  belongs to Class + Term
Payment  →  belongs to Student + Fee item
Balance  →  Fees for student − Payments for student

Recommended build order

Admin layout + dashboard ✅
Students (list, add, details, edit) ✅
Fee structure + payments + record payment ← you are here
Login / auth (admin + student roles)
Student portal (dashboard + fees + Paystack)
Backend (MongoDB APIs)
Connect frontend to backend
Deploy


Notes for production later

Never trust frontend for money amounts — backend calculates balance
Paystack webhook must be verified with secret key
Store payment reference from Paystack to avoid double-counting
Receipts can be PDF generated on the fly
Soft-delete fees if payments already exist against them

When these 3 fee screens are in routes and sidebar, next step is Auth (Login) so admin and student portals are protected.