import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface CardData {
  type: string;
  name: string;
  designation?: string;
  years?: string;
  location?: string;
  education?: string;
  email?: string;
  phone?: string;
  description?: string;
  congratsMessage?: string;
  reportingManager?: string;
  profileImageUrl?: string;
  smallProfileImageUrl?: string;
  [key: string]: string | undefined;
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const data: CardData = await request.json();
    
    // Get required fields
    const { type, name } = data;

    if (!type || !name) {
      return NextResponse.json(
        { details: 'Missing required fields: type and name' },
        { status: 400 }
      );
    }

    console.log('Starting generation with data:', data);

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport with higher resolution
    await page.setViewport({ 
      width: 2400, 
      height: 1800,
      deviceScaleFactor: 2
    });

    // Set longer timeout for navigation
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    
    // Navigate to the appropriate page based on card type
    const url = `${request.nextUrl.origin}/${type}`;
    console.log('Navigating to:', url);
    
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Update form values and preview elements based on card type
    await page.evaluate((data) => {
      const updateInput = (id: string, value?: string) => {
        if (!value) return;
        const input = document.querySelector(`#${id}`) as HTMLInputElement;
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };

      // Update all possible inputs based on card type
      updateInput('name', data.name);
      updateInput('designation', data.designation);
      updateInput('years', data.years);
      updateInput('location', data.location);
      updateInput('education', data.education);
      updateInput('email', data.email);
      updateInput('phone', data.phone);
      updateInput('description', data.description);
      updateInput('congrats-message', data.congratsMessage);

      // Update preview elements based on card type
      const previewElement = document.querySelector('[data-preview="true"]');
      if (!previewElement) return;

      if (data.type === 'birthday') {
        const namePreview = previewElement.querySelector('h2');
        if (namePreview) namePreview.textContent = data.name;
      } 
      else if (data.type === 'work-anniversary') {
        const nameText = previewElement.querySelector('.text-white.text-3xl');
        const designationText = previewElement.querySelector('.text-white.text-lg');
        const yearsText = previewElement.querySelector('.text-4xl');

        if (nameText) nameText.textContent = data.name;
        if (designationText) designationText.textContent = data.designation || '';
        if (yearsText && data.years) {
          const num = parseInt(data.years);
          const suffix = (j => {
            if (j === 1 && num !== 11) return "st";
            if (j === 2 && num !== 12) return "nd";
            if (j === 3 && num !== 13) return "rd";
            return "th";
          })(num % 10);
          yearsText.textContent = `${data.years}${suffix} WORK`;
        }
      }
      else if (data.type === 'onboarding') {
        // Update text content
        const nameElement = previewElement.querySelector('.text-3xl.font-bold.text-\\[\\#2F7B75\\]');
        const descElement = previewElement.querySelector('.text-gray-600.text-sm.leading-relaxed');
        const designationElement = previewElement.querySelector('.line-clamp-2');
        const educationElement = previewElement.querySelectorAll('.line-clamp-2')[1];
        const locationElement = previewElement.querySelectorAll('.line-clamp-2')[2];
        const emailElement = previewElement.querySelector('.text-white .text-sm');
        const phoneElement = previewElement.querySelectorAll('.text-white .text-sm')[1];
        const welcomeElement = previewElement.querySelector('.text-gray-600.italic.text-sm');

        if (nameElement) nameElement.textContent = data.name;
        if (descElement) descElement.textContent = data.description || '';
        if (designationElement) designationElement.textContent = data.designation || '';
        if (educationElement) educationElement.textContent = data.education || '';
        if (locationElement) locationElement.textContent = data.location || '';
        if (emailElement) emailElement.textContent = data.email || '';
        if (phoneElement) phoneElement.textContent = data.phone || '';
        if (welcomeElement) welcomeElement.textContent = data.congratsMessage || '';

        // Update profile images
        if (data.profileImageUrl) {
          const mainProfileContainer = previewElement.querySelector('.w-48.h-48');
          if (mainProfileContainer) {
            mainProfileContainer.innerHTML = `<img src="${data.profileImageUrl}" alt="Profile" class="w-full h-full object-cover">`;
          }
        }

        if (data.smallProfileImageUrl) {
          const smallProfileContainer = previewElement.querySelector('.w-12.h-12');
          if (smallProfileContainer) {
            smallProfileContainer.innerHTML = `<img src="${data.smallProfileImageUrl}" alt="Small Profile" class="w-full h-full object-cover">`;
          }
        }
      }
    }, data);

    // Wait for images to load if they exist
    if (data.type === 'onboarding' && (data.profileImageUrl || data.smallProfileImageUrl)) {
      await page.evaluate(async () => {
        const images = document.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return;
          return new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          });
        }));
      });
    }

    // Wait for any animations to complete and ensure the preview is ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Wait for the preview element to be visible
    await page.waitForSelector('[data-preview="true"]', { visible: true });

    // Get the preview element
    const previewElement = await page.$('[data-preview="true"]');
    if (!previewElement) {
      throw new Error('Preview element not found');
    }

    // Take screenshot
    const screenshot = await previewElement.screenshot({
      type: 'png',
      omitBackground: true
    });

    // Close browser
    await browser.close();
    browser = null;

    // Return the image with appropriate filename
    const filename = `${type}-${name.replace(/\s+/g, '-')}.png`;
    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Ensure browser is closed in case of error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    return NextResponse.json(
      { details: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 