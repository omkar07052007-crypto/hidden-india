# Hidden India — Web Technologies Mini Project

A responsive destination discovery website built as a student project using HTML5, CSS3, Bootstrap 5, JavaScript DOM manipulation and a small Node.js server.

## Features
- Responsive layout with Bootstrap and custom CSS
- Search destinations by name, state or description
- Filter by category and best time to visit
- Destination details and favourites (saved in browser localStorage)
- Trip planner with a generated sample itinerary
- Client-side feedback validation
- Feedback API endpoint with server-side validation
- Custom 404 response, dark mode and mobile-friendly layout

## Deploy on Vercel (recommended steps)
1. Download and extract this project folder.
2. Sign in to GitHub and create a **new repository** (for example, `hidden-india`).
3. Upload the contents of the `hidden_india` folder to the repository root. Make sure `index.html`, `styles.css`, `app.js`, `package.json`, and the `api` folder are at the top level of the repository—not inside an extra nested folder.
4. Open https://vercel.com and sign in using GitHub.
5. Choose **Add New → Project**, import your `hidden-india` GitHub repository, and click **Deploy**. This is a plain HTML/CSS/JavaScript site with a Vercel Function under `api/feedback.js`; normally you can keep the default build settings and leave the build command and output directory empty.
6. When deployment finishes, open the generated `.vercel.app` URL and test the destination search, filters, favorites, trip planner, dark mode and feedback form.

### Important note about feedback storage
The Vercel API endpoint validates feedback submissions, but this demo does **not** permanently store submitted feedback. Vercel Functions have a read-only filesystem apart from temporary scratch storage. Permanent storage would require connecting a database or object-storage service. When running locally with `npm start`, the original `server.js` stores feedback in `data/feedback.json`.

## Run locally
1. Install Node.js 18 or later.
2. Open a terminal in this project folder.
3. Run `npm start` (or `node server.js`).
4. Open `http://localhost:3000` in your browser.

## Notes
- Destination cards intentionally use a clean, image-free design with subtle initials and category labels, avoiding mismatched or missing destination photos.
- Destination descriptions and itineraries are for a student demonstration. Verify local travel conditions and details before relying on them.
- This is an educational demo, not a production booking service. It does not process payments or reserve transport/accommodation.
