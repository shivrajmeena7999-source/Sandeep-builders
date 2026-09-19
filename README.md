# Sandeep Builders - Single Page Website

A professional single-page website for Sandeep Builders, a construction company based in Sehore & Bhopal, Madhya Pradesh, India. Features a dark navy and gold theme with an admin panel for content management.

## Features

- **Professional Design**: Dark navy (#0B1524) and gold (#D6A94B) color scheme
- **Typography**: Poppins for headings, Inter for body text
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Admin Panel**: Secure login for content editing
- **Content Management**: Edit text and images directly on the page
- **Image Upload**: Upload new photos for gallery and projects
- **Contact Form**: Functional contact form with validation
- **Smooth Navigation**: Smooth scrolling between sections

## Sections

1. **Top Utility Bar**: Phone, email, location, and social icons
2. **Header**: Logo with roofline icon, navigation, and "Get a Quote" button
3. **Hero**: Dark background, headline with gold accent, CTA buttons, feature strip
4. **Services**: 6 service cards with icons
5. **About**: Company description with photo and 4 stat boxes
6. **Gallery**: 8-photo grid (2 large + 6 small) with category tags
7. **Projects**: 6 project cards with photos and locations
8. **Contact**: Hindi heading, contact details, and contact form
9. **Footer**: Logo, sitemap, social links, and copyright

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the single-page directory:
```bash
cd sandeep-builders/single-page
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The website will be available at `http://localhost:5000`

## Admin Access

### Login

1. Double-click on the "SANDEEP BUILDERS" logo in the header
2. Enter admin credentials:
   - Email: `admin@sandeepbuilders.com`
   - Password: `admin123`

### Editing Content

Once logged in as admin:

1. **Text Editing**: Click on any text element to edit it inline
2. **Image Editing**: Click on any image to upload a new one
3. **Save Changes**: Click "Save All Changes" in the admin panel
4. **Reset**: Click "Reset to Default" to restore original content

### Security

**IMPORTANT**: Change the default admin credentials in production!

To change admin credentials:
1. Edit the `initializeAdmin` function in `server.js`
2. Set a new email and password
3. Restart the server

Or use the setup endpoint:
```bash
POST /api/auth/setup
{
  "email": "your-email@example.com",
  "password": "your-secure-password",
  "name": "Your Name",
  "setupKey": "sandeep-builders-setup"
}
```

## File Structure

```
single-page/
├── index.html          # Main HTML structure
├── styles.css          # Styling with dark navy/gold theme
├── script.js           # Frontend JavaScript
├── server.js           # Express server with API
├── package.json        # Node.js dependencies
├── README.md          # This file
├── uploads/           # Uploaded images (created automatically)
└── content.json       # Saved content (created automatically)
```

## API Endpoints

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content` - Save content (admin only)

### Image Upload
- `POST /api/upload` - Upload image (admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Create admin account

### Contact Form
- `POST /api/contact` - Submit contact form

## Customization

### Colors

Edit the CSS variables in `styles.css`:
```css
:root {
    --navy-primary: #0B1524;
    --navy-secondary: #122035;
    --navy-tertiary: #1A2B42;
    --gold-primary: #D6A94B;
    --gold-secondary: #B8923D;
    --gold-hover: #E5B85A;
}
```

### Fonts

The website uses Google Fonts:
- Poppins (headings)
- Inter (body text)

To change fonts, update the Google Fonts link in `index.html` and the font-family in `styles.css`.

### Content

All default content is in `index.html`. To change initial content, edit the HTML directly or use the admin panel after deployment.

## Deployment

### Local Deployment

```bash
npm start
```

### Production Deployment

1. Set environment variables:
```bash
export PORT=5000
export JWT_SECRET=your-secure-secret-key
```

2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name sandeep-builders
```

3. For cloud deployment, platforms like Heroku, Railway, or DigitalOcean can be used.

### Static File Serving

For static hosting (Vercel, Netlify, GitHub Pages):
1. The frontend can be deployed as static files
2. The backend needs to be deployed separately
3. Update the `API_BASE_URL` in `script.js` to point to your backend

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port Already in Use
If port 5000 is in use, change the PORT in `package.json` or set the PORT environment variable.

### Images Not Uploading
- Ensure the `uploads` directory exists
- Check file permissions
- Verify image format (JPEG, PNG, GIF, WebP)

### Admin Login Not Working
- Check that the server is running
- Verify credentials (default: admin@sandeepbuilders.com / admin123)
- Clear browser cache and localStorage

### Content Not Saving
- Check server logs for errors
- Verify write permissions for `content.json`
- Ensure admin token is valid

## Features Overview

### Public View
- Visitors see the complete website with all sections
- Contact form works for all visitors
- No editing capabilities

### Admin View
- Secure login required
- Edit text elements by clicking on them
- Upload images by clicking on image placeholders
- Save changes to persist for all visitors
- Reset to default content if needed

### Data Persistence
- Content is saved to `content.json` file
- Images are saved to `uploads/` directory
- In production, consider using a database for better scalability

## License

This project is created for Sandeep Builders.

## Support

For issues or questions, please refer to the code documentation or contact the development team.

---

**Built with HTML, CSS, JavaScript, Node.js, and Express**