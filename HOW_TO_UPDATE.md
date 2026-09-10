# How to Update & Maintain Your NGO Website

This guide explains how you or your team at **Gramin Jan Chetna Seva Sansthan** can easily post daily activity updates, add new photos, and change details on your live website after publishing.

---

## 1. 📰 How to Post Daily Activity Updates (No Coding Needed!)

Your website includes a built-in **Daily Updates Manager** right on the site:

1. Go to the **"दैनिक गतिविधियां" (Daily Updates)** page on your live website.
2. Click the orange **"+ नई गतिविधि जोड़ें" (+ Add New Update)** button at the top.
3. Fill in:
   - **Title** (e.g., *100 बच्चों को कॉपी वितरण - बस्ती*)
   - **Category** (*Kit Distribution*, *Free Classes*, or *Special Events*)
   - **Location** (e.g., *ग्राम पंचायत बस्ती सदर*)
   - **Description** (details of today's work)
4. Click **"प्रकाशित करें" (Publish Post)**.
5. The new update will instantly show up at the top of your feed!

---

## 2. 🖼️ How to Add New Photos to the Gallery

When you take new photos during kit distribution drives or classes:

1. **Save your photo** inside the project folder:
   `gramin-jan-chetna-seva-sansthan/assets/images/new_photo.jpg`
2. **Open `index.html`** in a text editor (or directly on GitHub/Netlify).
3. Scroll to the `<main id="gallery">` section and add a new photo card line:
   ```html
   <div class="gallery-item">
     <img src="assets/images/new_photo.jpg" alt="Kit distribution in Basti">
     <div class="gallery-overlay">निःशुल्क अध्ययन सामग्री वितरण 2026</div>
   </div>
   ```
4. Save and re-upload/push the file to Netlify or GitHub. Your live website will automatically show the new photo!

---

## 3. ✏️ How to Edit Text, Phone Number, or Bank Account Details

To edit any written text or bilingual translation:

1. Open **`js/lang.js`** in your text editor.
2. Find the detail you want to change (e.g., phone number, bank account number, address, or President quote).
3. Update the Hindi (`hi`) or English (`en`) text:
   ```javascript
   phoneLabel: "फोन / व्हाट्सएप: +91 7376487596",
   accNumber: "खाता संख्या: 398200100XXXX",
   ```
4. Save the file and re-upload. Netlify / GitHub Pages will update your live website within 30 seconds!

---

## 🚀 How Live Updates Work on Hosted Platforms:

- **Netlify**: Whenever you edit files, just drag and drop the `gramin-jan-chetna-seva-sansthan` folder again into [app.netlify.com/drop](https://app.netlify.com/drop). It updates your site instantly!
- **GitHub Pages**: Whenever you commit or upload modified files to GitHub, GitHub automatically rebuilds and publishes the changes to your free web address within 1 minute!
