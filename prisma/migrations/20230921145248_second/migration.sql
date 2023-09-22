/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_user_id_fkey";

-- DropForeignKey
ALTER TABLE "event_documents" DROP CONSTRAINT "event_documents_document_id_fkey";

-- DropForeignKey
ALTER TABLE "event_documents" DROP CONSTRAINT "event_documents_event_id_fkey";

-- DropForeignKey
ALTER TABLE "user_categories" DROP CONSTRAINT "user_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "user_categories" DROP CONSTRAINT "user_categories_user_id_fkey";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "document";

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "event_documents";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_categories";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "alert" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDocuments" (
    "event_id" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventDocuments_pkey" PRIMARY KEY ("event_id","document_id")
);

-- CreateTable
CREATE TABLE "UserCategories" (
    "user_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "UserCategories_pkey" PRIMARY KEY ("user_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_user_id_key" ON "Document"("user_id");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocuments" ADD CONSTRAINT "EventDocuments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocuments" ADD CONSTRAINT "EventDocuments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategories" ADD CONSTRAINT "UserCategories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategories" ADD CONSTRAINT "UserCategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
