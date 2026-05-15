# 🚀 GitHub Pages Deployment Guide

Follow these steps to deploy your CV website to **https://abdulaziz-alshihry.github.io**

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** button (top right) → **New repository**
3. Repository name: **`abdulaziz-alshihry.github.io`** (exactly this name!)
4. Description: "My Professional CV Website"
5. Set to **Public**
6. **DO NOT** check "Add a README file"
7. Click **Create repository**

## Step 2: Download Your Project Files

You need to download all the project files from Figma Make. Here's what you'll need:

### Required Files & Folders:
```
📁 Your Project
├── 📁 .github/workflows/
│   └── deploy.yml
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 components/
│   │   │   └── CVWebsite.tsx
│   │   └── App.tsx
│   └── 📁 styles/
├── 📄 .gitignore
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 README.md
└── 📄 DEPLOYMENT_GUIDE.md (this file)
```

## Step 3: Upload to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Click **File** → **Add Local Repository**
4. Select your project folder
5. Click **Publish repository**
6. Push to GitHub

### Option B: Using Git Command Line

Open terminal/command prompt in your project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - My CV website"

# Add your GitHub repository as remote
git remote add origin https://github.com/abdulaziz-alshihry/abdulaziz-alshihry.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (tab near the top)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Wait 2-3 minutes for the deployment to complete

## Step 5: View Your Live Website!

Your CV will be live at:
### **https://abdulaziz-alshihry.github.io**

🎉 Congratulations! Your CV is now online!

---

## 🔄 How to Update Your CV Later

Whenever you want to update your CV:

1. Edit the files (especially `CVWebsite.tsx`)
2. Commit changes:
   ```bash
   git add .
   git commit -m "Updated CV information"
   git push
   ```
3. GitHub will automatically rebuild and deploy (2-3 minutes)

---

## 🆘 Troubleshooting

### "Repository name already taken"
Someone else is using that username. Try:
- `abdulazizalshihry.github.io` (no hyphens)
- `abdulaziz-cv.github.io`
- Or use a regular repo name and it will be: `github.com/yourusername/reponame`

### "Blank page after deployment"
1. Check GitHub Actions tab for errors
2. Make sure all files uploaded correctly
3. Wait 5 minutes and clear browser cache

### "Build failed"
Check the Actions tab in your GitHub repository for error details.

---

## 📱 Share Your CV

Once live, you can share your CV link:
- On LinkedIn
- In your email signature
- On business cards
- In job applications

---

## 💡 Need Help?

If you run into issues:
1. Check the **Actions** tab in your GitHub repository
2. Look for error messages
3. Make sure all files were uploaded correctly
