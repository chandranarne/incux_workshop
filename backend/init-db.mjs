import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const statements = [
  `DROP TABLE IF EXISTS public.payments CASCADE`,
  `DROP TABLE IF EXISTS public.inquiries CASCADE`,
  `DROP TABLE IF EXISTS public.registrations CASCADE`,
  `DROP TABLE IF EXISTS public.upcoming_workshops CASCADE`,
  `DROP TABLE IF EXISTS public.custom_requests CASCADE`,
  `DROP TABLE IF EXISTS public.users CASCADE`,
  `CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'candidate',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "institution" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public.users_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE "public"."custom_requests" (
    "id" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "institution" TEXT NOT NULL,
    "preferredLocation" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL DEFAULT 'Undergraduate & Graduate Engineers',
    "estimatedStudents" INTEGER NOT NULL DEFAULT 100,
    "preferredDates" TEXT NOT NULL DEFAULT 'Flexible / TBD',
    "specialRequirements" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    CONSTRAINT "public.custom_requests_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE "public"."upcoming_workshops" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 100,
    "registered" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL DEFAULT 'Offline',
    "speaker" TEXT NOT NULL DEFAULT 'IncuxAI Technical Mentor',
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "fee" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedFromRequestId" TEXT,
    CONSTRAINT "public.upcoming_workshops_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE "public"."registrations" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "workshopTitle" TEXT NOT NULL,
    "workshopCategory" TEXT,
    "workshopDates" TEXT,
    "workshopLocation" TEXT,
    "workshopMode" TEXT,
    "candidateName" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "candidateInstitution" TEXT,
    "candidatePhone" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "public.registrations_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE "public"."inquiries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Academic / Administrator',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT 'Not provided',
    "workshopInterest" TEXT NOT NULL DEFAULT 'General AI & Tech Exploration',
    "estimatedStudents" TEXT NOT NULL DEFAULT '50-100',
    "mode" TEXT NOT NULL DEFAULT 'Offline Campus Experience',
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Received',
    CONSTRAINT "public.inquiries_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "upcomingWorkshopId" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "gatewayResponse" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "public.payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "public.payments_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "public.payments_upcomingWorkshopId_fkey" FOREIGN KEY ("upcomingWorkshopId") REFERENCES "public"."upcoming_workshops"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE INDEX "public.payments_registrationId_idx" ON "public"."payments"("registrationId")`,
];

async function main() {
  for (let i = 0; i < statements.length; i++) {
    try {
      await prisma.$executeRawUnsafe(statements[i]);
      console.log(`[${i + 1}/${statements.length}] OK`);
    } catch (e) {
      console.log(`[${i + 1}/${statements.length}] SKIPPED: ${e.message.split('\n')[0]}`);
    }
  }
  console.log('Done');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
