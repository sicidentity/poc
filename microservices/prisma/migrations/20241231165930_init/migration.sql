-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "qrSignature" TEXT NOT NULL,
    "qrTimestamp" TIMESTAMP(3) NOT NULL,
    "program" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nin" (
    "id" TEXT NOT NULL,
    "ninNumber" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "registrationLocation" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentNumber_key" ON "User"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Nin_ninNumber_key" ON "Nin"("ninNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Nin_userId_key" ON "Nin"("userId");

-- AddForeignKey
ALTER TABLE "Nin" ADD CONSTRAINT "Nin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
