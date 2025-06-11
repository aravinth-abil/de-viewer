# Document & Excel Viewer

A modern React application for viewing and editing Excel files and documents with AI-powered features.

## 🚀 Features

### Excel Viewer

- ✅ Multi-sheet Excel file support (.xlsx, .xls, .csv)
- ✅ Sheet tab navigation
- ✅ Search and filter functionality
- ✅ Column sorting
- ✅ Responsive table design
- ✅ Large file optimization

### Document Editor

- ✅ WYSIWYG rich text editor
- ✅ Google Docs-like editing experience
- ✅ Automatic table of contents generation
- ✅ Real-time content updates
- ✅ Format preservation
- ✅ Text selection for AI features

### AI Integration (Mistral AI)

- ✅ Text improvement and grammar correction
- ✅ Content summarization
- ✅ Text expansion with context
- ✅ Multi-language translation
- ✅ Custom AI prompts
- ✅ Real-time processing indicators

### UI/UX Features

- ✅ Material Design components
- ✅ Shimmer loading states
- ✅ Dark/Light theme support
- ✅ Responsive design
- ✅ Drag & drop file upload
- ✅ Progress indicators
- ✅ Error handling with user feedback

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Mistral AI API key

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd document-excel-viewer
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Edit `.env` and add your Mistral AI API key:

```env
REACT_APP_MISTRAL_API_KEY=your_mistral_api_key_here
REACT_APP_MISTRAL_ENDPOINT=https://api.mistral.ai/v1/chat/completions
```

4. **Start development server**

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── FileUploader.js
│   ├── ExcelViewer.js
│   ├── DocumentEditor.js
│   ├── TableOfContents.js
│   ├── AIAssistant.js
│   └── ShimmerLoader.js
├── hooks/              # Custom React hooks
│   ├── useFileUpload.js
│   ├── useAI.js
│   ├── useTableOfContents.js
│   └── useLocalStorage.js
├── services/           # External API services
│   └── mistralAPI.js
├── utils/              # Utility functions
│   ├── validation.js
│   ├── helpers.js
│   └── constants.js
├── styles/             # Styling files
└── App.js             # Main application component
```

## 🔧 Configuration

### File Upload Limits

- Maximum file size: 50MB (configurable)
- Supported formats: .xlsx, .xls, .csv, .docx, .doc, .txt, .rtf

### AI Features

- Text length limit: 5000 characters
- Request timeout: 30 seconds
- Retry attempts: 3

### Excel Viewer

- Maximum rows displayed: 1000 (configurable)
- Empty cell placeholder: Visual indicator
- Search functionality: Real-time filtering

## 🎯 Usage

### Uploading Files

1. **Drag & Drop**: Drag files directly onto the upload area
2. **Click Upload**: Click the upload area to select files
3. **File Validation**: Automatic file type and size validation

### Excel Files

1. **View Data**: Tables with pagination and sorting
2. **Navigate Sheets**: Click sheet tabs to switch between worksheets
3. **Search**: Use the search box to filter table content
4. **Sort**: Click column headers to sort data

### Document Files

1. **Edit Content**: Rich text editing with formatting tools
2. **AI Enhancement**: Select text to see AI suggestions
3. **Table of Contents**: Auto-generated navigation sidebar
4. **Export**: Save edited documents

### AI Features

1. **Select Text**: Highlight any text in the document
2. **Choose Action**: Pick from improve, summarize, expand, or translate
3. **Review Suggestion**: AI-generated content appears in sidebar
4. **Apply Changes**: Replace original text with AI suggestion

## 🔌 API Integration

### Mistral AI Setup

1. **Get API Key**: Sign up at [Mistral AI](https://mistral.ai/)
2. **Configure Environment**: Add key to `.env` file
3. **Test Connection**: Upload a document and try AI features

### Custom AI Prompts

```javascript
// Example: Custom AI processing
const result = await mistralAPI.customPrompt(
  selectedText,
  "Rewrite this text in a more formal tone",
  documentContext
);
```

## 🎨 Customization

### Themes

Modify `src/utils/constants.js` to customize colors and styling:

```javascript
export const THEMES = {
  light: {
    primary: "#1976d2",
    secondary: "#dc004e",
    // ... other colors
  },
};
```

### File Upload Limits

Adjust in `src/utils/constants.js`:

```javascript
export const APP_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxTableRows: 1000,
  // ... other settings
};
```

## 📚 Dependencies

### Core Libraries

- **React**: ^18.2.0 - UI framework
- **XLSX**: ^0.18.5 - Excel file processing
- **Axios**: ^1.6.2 - HTTP client for API calls
