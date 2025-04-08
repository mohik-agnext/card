import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get all form fields
    const type = formData.get('type') as string;
    const name = formData.get('name') as string;
    const designation = formData.get('designation') as string;
    const years = formData.get('years') as string;
    const location = formData.get('location') as string;
    const education = formData.get('education') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;
    const congratsMessage = formData.get('congratsMessage') as string;
    const reportingManager = formData.get('reportingManager') as string;
    const profileImageUrl = formData.get('profileImageUrl') as string;
    const smallProfileImageUrl = formData.get('smallProfileImageUrl') as string;

    console.log('Starting generation with data:', {
      type,
      name,
      designation,
      years,
      location,
      education,
      email,
      phone,
      description,
      congratsMessage,
      reportingManager,
      hasProfileImage: !!profileImageUrl,
      hasSmallProfileImage: !!smallProfileImageUrl
    });

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      await page.setViewport({ 
        width: 2400, 
        height: 1800,
        deviceScaleFactor: 2
      });
      
      // Navigate to the appropriate page based on card type
      let url = '';
      if (type === 'birthday') {
        url = `${request.nextUrl.origin}/birthday`;
      } else if (type === 'work-anniversary') {
        url = `${request.nextUrl.origin}/work-anniversary`;
      } else {
        url = `${request.nextUrl.origin}/onboarding`;
      }
      
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Update form values and preview elements based on card type
      if (type === 'birthday') {
        await page.evaluate((data) => {
          // Update name input and preview
          const nameInput = document.querySelector('#name') as HTMLInputElement;
          if (nameInput) {
            nameInput.value = data.name;
            nameInput.dispatchEvent(new Event('change', { bubbles: true }));
            nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          }

          // Update preview directly
          const previewElement = document.querySelector('[data-preview="true"]');
          if (previewElement) {
            const namePreview = previewElement.querySelector('h2');
            if (namePreview) namePreview.textContent = data.name;
          }
        }, { name });
      } else if (type === 'work-anniversary') {
        await page.evaluate((data) => {
          // Update form inputs
          const inputs = {
            name: document.querySelector('#name'),
            designation: document.querySelector('#designation'),
            years: document.querySelector('#years')
          };

          // Set values and dispatch events
          if (inputs.name && data.name) {
            (inputs.name as HTMLInputElement).value = data.name;
            inputs.name.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (inputs.designation && data.designation) {
            (inputs.designation as HTMLInputElement).value = data.designation;
            inputs.designation.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (inputs.years && data.years) {
            (inputs.years as HTMLInputElement).value = data.years;
            inputs.years.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Update preview directly
          const previewElement = document.querySelector('[data-preview="true"]');
          if (previewElement) {
            const nameText = previewElement.querySelector('.text-white.text-3xl');
            const designationText = previewElement.querySelector('.text-white.text-lg');
            const yearsText = previewElement.querySelector('.text-4xl');

            if (nameText) nameText.textContent = data.name;
            if (designationText) designationText.textContent = data.designation;
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
        }, { name, designation, years });
      } else {
        // Onboarding card
        await page.evaluate((data: { 
          name: string; 
          designation: string; 
          location: string; 
          education: string; 
          email: string; 
          phone: string; 
          description: string; 
          congratsMessage: string;
          [key: string]: string; 
        }) => {
          // Update form inputs
          const inputs = {
            name: document.querySelector('#name'),
            designation: document.querySelector('#designation'),
            location: document.querySelector('#location'),
            education: document.querySelector('#education'),
            email: document.querySelector('#email'),
            phone: document.querySelector('#phone'),
            description: document.querySelector('#description'),
            'congrats-message': document.querySelector('#congrats-message')
          };

          // Set values and dispatch events
          Object.entries(inputs).forEach(([key, input]) => {
            if (input && data[key]) {
              (input as HTMLInputElement).value = data[key];
              input.dispatchEvent(new Event('change', { bubbles: true }));
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });

          // Update preview elements directly
          const previewElement = document.querySelector('[data-preview="true"]');
          if (previewElement) {
            const nameElement = previewElement.querySelector('.text-3xl.font-bold.text-\\[\\#2F7B75\\]');
            if (nameElement) nameElement.textContent = data.name;

            const descElement = previewElement.querySelector('.text-gray-600.text-sm.leading-relaxed');
            if (descElement) descElement.textContent = data.description;

            const designationElement = previewElement.querySelector('.line-clamp-2');
            if (designationElement) designationElement.textContent = data.designation;

            const educationElement = previewElement.querySelectorAll('.line-clamp-2')[1];
            if (educationElement) educationElement.textContent = data.education;

            const locationElement = previewElement.querySelectorAll('.line-clamp-2')[2];
            if (locationElement) locationElement.textContent = data.location;

            const emailElement = previewElement.querySelector('.text-white .text-sm');
            if (emailElement) emailElement.textContent = data.email;

            const phoneElement = previewElement.querySelectorAll('.text-white .text-sm')[1];
            if (phoneElement) phoneElement.textContent = data.phone;

            const welcomeElement = previewElement.querySelector('.text-gray-600.italic.text-sm');
            if (welcomeElement) welcomeElement.textContent = data.congratsMessage;
          }
        }, {
          name,
          designation,
          location,
          education,
          email,
          phone,
          description,
          congratsMessage
        });
      }

      // Handle profile image for all card types
      if (profileImageUrl) {
        await page.evaluate((url) => {
          const container = document.querySelector('[data-preview="true"] .w-48.h-48');
          if (container) {
            container.innerHTML = `<img src="${url}" alt="Profile" class="w-full h-full object-cover">`;
          }
        }, profileImageUrl);

        // Wait for the image to load
        await page.waitForFunction(
          () => {
            const img = document.querySelector('[data-preview="true"] .w-48.h-48 img');
            return img && (img as HTMLImageElement).complete;
          },
          { timeout: 5000 }
        );
      }

      // Handle small profile image for onboarding card
      if (type === 'onboarding' && smallProfileImageUrl) {
        await page.evaluate((url) => {
          const container = document.querySelector('[data-preview="true"] .w-12.h-12');
          if (container) {
            container.innerHTML = `<img src="${url}" alt="Small Profile" class="w-full h-full object-cover">`;
          }
        }, smallProfileImageUrl);

        // Wait for the small image to load
        await page.waitForFunction(
          () => {
            const img = document.querySelector('[data-preview="true"] .w-12.h-12 img');
            return img && (img as HTMLImageElement).complete;
          },
          { timeout: 5000 }
        );
      }

      // Wait for all updates to be applied
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Take screenshot of the preview element
      const previewElement = await page.$('[data-preview="true"]');
      if (!previewElement) {
        throw new Error('Preview element not found');
      }

      const screenshot = await previewElement.screenshot({
        type: 'png',
        omitBackground: false
      });

      return new NextResponse(screenshot, {
        headers: {
          'Content-Type': 'image/png'
        }
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 