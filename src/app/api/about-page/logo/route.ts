import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { AboutPage } from "@/backend/entities/AboutPage";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const aboutPageRepository = AppDataSource.getRepository(AboutPage);
    
    // Get the first (and only) about page entry
    let aboutPage = await aboutPageRepository.findOne({
      where: {
        isActive: true
      }
    });

    // If no active entry exists, return default favicon
    if (!aboutPage || !aboutPage.logoUrl) {
      // Return default favicon
      const defaultFaviconPath = path.join(process.cwd(), "public", "favicon.ico");
      if (fs.existsSync(defaultFaviconPath)) {
        const fileBuffer = fs.readFileSync(defaultFaviconPath);
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": "image/x-icon",
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        });
      }
      
      // If no default favicon, return 404
      return new NextResponse("Favicon not found", { status: 404 });
    }

    // If logoUrl is a full URL, redirect to it
    if (aboutPage.logoUrl.startsWith('http')) {
      return NextResponse.redirect(aboutPage.logoUrl);
    }

    // If logoUrl is a local path, serve the file
    const logoPath = path.join(process.cwd(), "public", aboutPage.logoUrl.replace('/uploads/', '').replace(/^\//, ''));
    
    if (fs.existsSync(logoPath)) {
      const fileBuffer = fs.readFileSync(logoPath);
      const extension = path.extname(logoPath).toLowerCase();
      
      let contentType = "image/png";
      if (extension === ".jpg" || extension === ".jpeg") {
        contentType = "image/jpeg";
      } else if (extension === ".gif") {
        contentType = "image/gif";
      } else if (extension === ".ico") {
        contentType = "image/x-icon";
      }
      
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }
    
    // If logo file doesn't exist, return 404
    return new NextResponse("Logo not found", { status: 404 });
  } catch (error) {
    console.error("Error serving logo:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}