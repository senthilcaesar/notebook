import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Check if there is a 'sign in' button
    const loginBtn = await page.$('button:has-text("Sign in")');
    if (loginBtn) {
       console.log("Requires Google login. We can't easily test without mocking.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
