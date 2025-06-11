# Document & Excel Viewer

A modern React application for viewing and editing Excel files and documents with AI-powered features.

## 🚀 Features

### Excel Viewer

- ✅ Multi-sheet Excel file support (.xlsx, .xls, .csv)
- ✅ Empty cell handling with visual indicators
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

```bash
cp .env.example .env
```

Edit `.env` and add your Mistral AI API key:

```env
REACT_APP_MISTRAL_API_KEY=your_mistral_api_key_here
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

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **File Upload Fails**

   - Check file size (max 50MB)
   - Verify file format is supported
   - Ensure stable internet connection

2. **AI Features Not Working**

   - Verify Mistral API key is configured
   - Check API quota and billing
   - Ensure text selection is not empty

3. **Excel Files Not Loading**

   - Try opening in Excel first to verify file integrity
   - Check browser console for errors
   - Ensure XLSX library is loaded

4. **Performance Issues**
   - Large files may take time to process
   - Consider breaking large files into smaller chunks
   - Check browser memory usage

### Error Messages

- `File size exceeds limit`: File is too large
- `Unsupported file type`: File format not supported
- `AI processing failed`: API key or quota issue
- `Failed to read file`: File may be corrupted

## 📚 Dependencies

### Core Libraries

- **React**: ^18.2.0 - UI framework
- **XLSX**: ^0.18.5 - Excel file processing
- **Axios**: ^1.6.2 - HTTP client for API calls

### Development Tools

- **React Scripts**: 5.0.1 - Build tooling
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed description

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Version history
- [ ] Advanced Excel formulas
- [ ] PDF export
- [ ] Cloud storage integration
- [ ] Mobile app
- [ ] Offline mode
- [ ] Advanced AI features
