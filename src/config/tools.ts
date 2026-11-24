export interface ToolConfig {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  shortDesc: string;
  category: 'convert' | 'compress' | 'edit' | 'pdf' | 'media' | 'productivity';
  icon: string;
  acceptedFileTypes: string;
  acceptedMimeTypes?: string[];
  maxFileSizeMB: number;
  actionButtonText: string;
  outputExtension: string;
  hasPixelEditor?: boolean;
  isVideo?: boolean;
  isPopular?: boolean;
  steps: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  editorial: {
    heading: string;
    paragraphs: string[];
    features: {
      title: string;
      desc: string;
    }[];
  };
  relatedToolSlugs: string[];
}

export const STARTER_TOOLS: ToolConfig[] = [
  // 1. Image to PDF
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    title: 'Image to PDF Converter',
    metaTitle: 'Image to PDF Converter — Free JPG & PNG',
    metaDescription: 'Convert JPG, PNG, and WebP images into a single professional PDF document in seconds. 100% free, private in-browser tool with zero file uploads.',
    shortDesc: 'Convert single or multiple JPG and PNG photos into a clean, printable PDF document.',
    category: 'pdf',
    icon: 'FileImage',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to PDF',
    outputExtension: 'pdf',
    isPopular: true,
    steps: [
      { title: 'Upload Photos', description: 'Select single or multiple photos, scans, or receipts.' },
      { title: 'Auto-Format Layout', description: 'Each photo is cleanly positioned on standard document pages.' },
      { title: 'Download PDF', description: 'Download your unified, ready-to-print PDF file instantly.' }
    ],
    faqs: [
      { question: 'Can I combine multiple photos into one PDF?', answer: 'Yes! Select multiple photos at once and iLoveTools will automatically stitch them into consecutive pages in a single PDF document.' },
      { question: 'Is image quality preserved during conversion?', answer: 'Yes, original image resolution and clarity are preserved without compression artifacts.' },
      { question: 'Are my photos uploaded to a cloud server?', answer: 'Never. iLoveTools processes all files locally inside your browser memory. Your personal photos and documents never touch external servers.' },
      { question: 'Is there any daily limit or watermark?', answer: 'No. iLoveTools is 100% free with unlimited conversions and zero watermarks.' }
    ],
    editorial: {
      heading: 'Convert Images to PDF Online Without Compromising Privacy',
      paragraphs: [
        'Converting JPG, PNG, and WebP images to a unified PDF document is an essential daily workflow for students, accountants, legal teams, and remote professionals submitting invoices, expense receipts, and identity documents.',
        'Unlike cloud-based conversion platforms like Smallpdf or iLovePDF that transfer your personal photos to remote servers, iLoveTools executes the entire conversion locally inside your browser engine. This eliminates the risk of unauthorized data harvesting or sensitive document leaks.',
        'With support for multi-image uploads, automatic page orientation, and zero artificial file size limits, iLoveTools delivers enterprise-grade PDF creation completely free of charge.'
      ],
      features: [
        { title: '100% In-Browser Privacy', desc: 'Files never leave your computer. Processing occurs locally in your device memory.' },
        { title: 'Multi-Image Stitching', desc: 'Combine dozens of receipt scans or photos into a sequential multi-page document.' },
        { title: 'Lossless Visual Quality', desc: 'Preserves sharp text, clear scans, and natural color balance without compression blur.' },
        { title: 'Zero Paywalls or Watermarks', desc: 'Unlimited conversions without subscriptions, account signups, or branding marks.' }
      ]
    },
    relatedToolSlugs: ['compress-image', 'pdf-to-jpg', 'merge-pdf', 'crop-photo', 'compress-pdf']
  },

  // 2. PDF to Excel
  {
    id: 'pdf-to-excel',
    slug: 'pdf-to-excel',
    title: 'PDF to Excel Converter',
    metaTitle: 'PDF to Excel Converter — Extract to XLSX',
    metaDescription: 'Extract tables, spreadsheets, and financial reports from PDF into editable Microsoft Excel (.xlsx) workbooks online. 100% free, fast, and private.',
    shortDesc: 'Extract tables and spreadsheet data into editable Microsoft Excel (.xlsx) workbooks.',
    category: 'convert',
    icon: 'Sheet',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to Excel',
    outputExtension: 'xlsx',
    isPopular: true,
    steps: [
      { title: 'Upload your PDF', description: 'Drag and drop your PDF document or click Select File.' },
      { title: 'Extract Tables', description: 'Our extraction engine automatically parses data rows, columns, and numeric cells.' },
      { title: 'Download Excel', description: 'Save your clean, fully editable .xlsx workbook instantly.' }
    ],
    faqs: [
      { question: 'Will table structure and formatting be preserved?', answer: 'Yes! Our table parsing engine detects column boundaries, cell alignments, and numeric structures to recreate an accurate spreadsheet.' },
      { question: 'Is it safe to upload confidential financial PDF statements?', answer: 'Yes. iLoveTools runs completely inside your browser client. Financial audits, tax returns, and bank statements are never transmitted over the internet.' },
      { question: 'Do I need Microsoft Office installed?', answer: 'No. The generated .xlsx workbook opens seamlessly in Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers.' },
      { question: 'Does iLoveTools impose a conversion limit?', answer: 'None. You can extract tables from as many documents as needed with no paywalls or cooldown periods.' }
    ],
    editorial: {
      heading: 'Extract PDF Tables to Editable Excel Spreadsheets Instantly',
      paragraphs: [
        'Locked tables inside PDF bank statements, vendor invoices, and financial reports often force analysts and accountants into hours of tedious manual data entry. iLoveTools eliminates manual transcribing by converting tabular PDF data directly into structured, editable Excel (.xlsx) files.',
        'Traditional converters upload sensitive financial reports to third-party cloud infrastructure, presenting serious data security concerns under GDPR and corporate compliance guidelines. iLoveTools operates 100% on client-side WebAssembly, ensuring confidential data never exits your workstation.',
        'Enjoy lightning-fast extraction that retains column headers, numerical precision, and grid layout for seamless import into financial modeling and accounting software.'
      ],
      features: [
        { title: 'Local Table Extraction', desc: 'Parses rows, columns, and numeric data without uploading confidential PDFs.' },
        { title: 'Universal XLSX Compatibility', desc: 'Directly compatible with Microsoft Excel, Google Sheets, and LibreOffice.' },
        { title: 'Preserved Column Hierarchy', desc: 'Maintains tabular alignment and numerical formatting for quick spreadsheet analysis.' },
        { title: 'No Subscription Gates', desc: 'Extract unlimited documents without restrictive daily quotas or paid tiers.' }
      ]
    },
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-powerpoint', 'compress-pdf', 'merge-pdf', 'split-pdf']
  },

  // 3. PDF to PowerPoint
  {
    id: 'pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    title: 'PDF to PowerPoint Converter',
    metaTitle: 'PDF to PowerPoint — Free Convert to PPTX',
    metaDescription: 'Convert PDF presentation decks into fully editable Microsoft PowerPoint (.pptx) slides in seconds. Free, private, and instant with zero file uploads.',
    shortDesc: 'Convert PDF presentation slide decks into fully editable PowerPoint (.pptx) slides.',
    category: 'convert',
    icon: 'Presentation',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to PowerPoint',
    outputExtension: 'pptx',
    isPopular: true,
    steps: [
      { title: 'Upload PDF Deck', description: 'Select the presentation PDF you want to convert into slides.' },
      { title: 'Reconstruct Slides', description: 'Each PDF page is converted into a distinct, editable slide with text and visual elements.' },
      { title: 'Download PPTX', description: 'Download your .pptx presentation ready for PowerPoint, Keynote, or Google Slides.' }
    ],
    faqs: [
      { question: 'Can I edit the text and images in the converted slides?', answer: 'Yes! Content elements are separated into distinct PowerPoint layers that you can modify, restyle, or animate.' },
      { question: 'Does it work with Google Slides and Apple Keynote?', answer: 'Yes, the generated .pptx format is natively compatible with Google Slides, Apple Keynote, and Microsoft 365.' },
      { question: 'Is my slide deck kept confidential?', answer: 'Absolutely. Presentation decks are processed locally on your machine with zero server communication.' }
    ],
    editorial: {
      heading: 'Turn Static PDF Slides into Dynamic, Editable PowerPoint Presentations',
      paragraphs: [
        'When key pitch decks, corporate slide presentations, or webinar summaries are shared as flat PDFs, updating a single bullet point or adapting a graphic can seem impossible. iLoveTools transforms static PDF decks into fully customizable Microsoft PowerPoint (.pptx) presentations.',
        'Each page is mapped to a dedicated presentation slide, preserving aspect ratios and graphical layouts so you can present or collaborate immediately.',
        'Because iLoveTools operates entirely client-side, proprietary business strategies, client pitch decks, and internal training slides remain strictly confidential on your computer.'
      ],
      features: [
        { title: 'Individual Slide Segmentation', desc: 'Accurately maps each PDF page to an independent, reorderable PowerPoint slide.' },
        { title: 'Universal Presentation Support', desc: 'Seamlessly opens in Microsoft Office, Google Slides, and Apple Keynote.' },
        { title: 'Proprietary Deck Protection', desc: 'Confidential presentations are never uploaded to remote servers or stored in cloud databases.' },
        { title: 'Instant In-Browser Render', desc: 'No email submission or waiting in server conversion queues.' }
      ]
    },
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-excel', 'image-to-pdf', 'compress-pdf', 'split-pdf']
  },

  // 4. PDF to Word
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    title: 'PDF to Word Converter',
    metaTitle: 'PDF to Word Converter — Convert to DOCX',
    metaDescription: 'Convert PDF documents into editable Word (.docx) files online with layout and text formatting preserved. 100% private, free, and secure in-browser.',
    shortDesc: 'Turn PDF documents into editable Word (.docx) files with paragraphs and fonts preserved.',
    category: 'convert',
    icon: 'FileText',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to Word',
    outputExtension: 'docx',
    isPopular: true,
    steps: [
      { title: 'Upload PDF', description: 'Drop your PDF document into the upload zone.' },
      { title: 'Process Document', description: 'Identifies headings, paragraphs, bullet points, and images.' },
      { title: 'Download DOCX', description: 'Receive a clean, editable Microsoft Word document.' }
    ],
    faqs: [
      { question: 'How accurate is the text and paragraph conversion?', answer: 'Our converter keeps paragraph structure, headings, bullet lists, and font styles neatly intact.' },
      { question: 'Do I need Microsoft Word installed to view the file?', answer: 'No, you can open the downloaded .docx file in Microsoft Word, Google Docs, LibreOffice, or Pages.' },
      { question: 'Are legal contracts and sensitive documents safe?', answer: 'Yes. Files are processed locally on your device and are never transmitted across the network.' }
    ],
    editorial: {
      heading: 'Convert PDF Documents to Editable Microsoft Word (.docx) Files',
      paragraphs: [
        'Re-typing contracts, research papers, or resumes saved as read-only PDFs wastes valuable hours. iLoveTools allows you to effortlessly convert fixed-layout PDF files into fully editable Microsoft Word (.docx) documents.',
        'Our parsing engine identifies natural paragraph breaks, headings, and formatting hierarchies so you can edit content immediately without rebuilding document layout from scratch.',
        'Enjoy total peace of mind: legal contracts, medical records, and personnel documents remain 100% private because all processing is executed locally in your browser.'
      ],
      features: [
        { title: 'True Document Editability', desc: 'Generates clean .docx files ready for editing in Word, Google Docs, and LibreOffice.' },
        { title: 'Formatting Retention', desc: 'Retains paragraphs, bold/italic styles, headings, and lists.' },
        { title: 'Confidentiality Guaranteed', desc: 'Zero cloud upload means compliance with privacy standards and NDA requirements.' },
        { title: 'Free & Unlimited', desc: 'No 2-task daily limits or mandatory subscription upgrades.' }
      ]
    },
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'compress-pdf', 'merge-pdf', 'split-pdf']
  },

  // 5. PNG to JPG
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    title: 'PNG to JPG Converter',
    metaTitle: 'PNG to JPG Converter — Free & Fast Online',
    metaDescription: 'Convert transparent PNG graphics into high-quality JPG images instantly in your browser. 100% free, private processing with zero file size limits.',
    shortDesc: 'Convert PNG images to standard high-compatibility JPG format with clean white background.',
    category: 'convert',
    icon: 'FileImage',
    acceptedFileTypes: '.png',
    acceptedMimeTypes: ['image/png'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to JPG',
    outputExtension: 'jpg',
    steps: [
      { title: 'Upload PNG', description: 'Select your transparent or high-resolution PNG image.' },
      { title: 'Flatten Transparency', description: 'Transparent areas are cleanly converted with a smooth neutral background.' },
      { title: 'Download JPG', description: 'Save your optimized, universal JPG image.' }
    ],
    faqs: [
      { question: 'What happens to transparent backgrounds in PNG?', answer: 'Since the JPG format does not support transparency, transparent areas are automatically rendered with a clean white background.' },
      { question: 'Does converting to JPG reduce file size?', answer: 'Yes, JPG compression drastically reduces heavy PNG file sizes while maintaining sharp photographic detail.' }
    ],
    editorial: {
      heading: 'Convert Transparent PNGs to Standard Lightweight JPG Photos',
      paragraphs: [
        'PNG files provide excellent lossless graphics and alpha-channel transparency, but their large file sizes often cause slow webpage loading, email attachment failures, and compatibility issues with legacy software.',
        'iLoveTools PNG to JPG Converter flattens transparent pixels onto a clean white background and applies optimized JPEG encoding to drastically reduce file sizes without noticeable detail loss.',
        'The conversion runs completely inside your browser using hardware-accelerated Canvas rendering, giving you instant results with complete privacy.'
      ],
      features: [
        { title: 'Intelligent Background Fill', desc: 'Gracefully flattens alpha transparency onto a clean background.' },
        { title: 'Dramatic Size Reduction', desc: 'Shrinks heavy PNG graphics into lightweight, web-ready JPEG images.' },
        { title: 'Instant Canvas Processing', desc: 'Converts in milliseconds using local browser hardware acceleration.' },
        { title: 'Zero Data Transmission', desc: 'Your private photos never leave your device.' }
      ]
    },
    relatedToolSlugs: ['jpg-to-png', 'compress-image', 'heic-to-jpg', 'crop-photo', 'image-to-pdf']
  },

  // 6. JPG to PNG
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    title: 'JPG to PNG Converter',
    metaTitle: 'JPG to PNG Converter — Lossless & Free',
    metaDescription: 'Convert JPG photos to lossless PNG format online with maximum clarity and transparency support. 100% free, instant, and private in-browser utility.',
    shortDesc: 'Convert JPG photos to lossless PNG format to prevent compression artifacts.',
    category: 'convert',
    icon: 'FileImage',
    acceptedFileTypes: '.jpg,.jpeg',
    acceptedMimeTypes: ['image/jpeg'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to PNG',
    outputExtension: 'png',
    steps: [
      { title: 'Upload JPG', description: 'Choose your JPG or JPEG photo.' },
      { title: 'Encode Lossless', description: 'Re-encodes image data into crisp 24-bit PNG format.' },
      { title: 'Download PNG', description: 'Save your pristine, artifact-free PNG file.' }
    ],
    faqs: [
      { question: 'Why convert JPG to PNG?', answer: 'PNG uses lossless compression, making it ideal for images that need multiple editing cycles, digital art, or sharp text overlays without generation loss.' },
      { question: 'Will converting JPG to PNG create transparency?', answer: 'No, converting a JPG will not automatically create transparency, but it produces a lossless container ready for alpha editing in graphic editors.' }
    ],
    editorial: {
      heading: 'Convert JPG to Lossless 24-Bit PNG for Flawless Editing',
      paragraphs: [
        'JPEG compression is lossy, meaning every time you open, edit, and re-save a JPG photo, visual compression artifacts multiply. Converting your files to PNG provides a stable, lossless container for ongoing graphic design and digital printing.',
        'iLoveTools re-encodes your JPEG bitmaps into clean 24-bit PNG structures directly inside your browser, ensuring maximum fidelity without upload queues.',
        'Ideal for logos, screenshots, infographics, and technical diagrams requiring crisp line art.'
      ],
      features: [
        { title: 'Lossless Container', desc: 'Halts JPEG compression degradation for ongoing editing workflows.' },
        { title: 'Crisp Line Reproduction', desc: 'Optimized for diagrams, text screenshots, and logo graphics.' },
        { title: '100% Client-Side', desc: 'Ultra-fast conversion powered by native browser rendering.' },
        { title: 'No Watermarks or Fees', desc: 'Completely free for personal and commercial usage.' }
      ]
    },
    relatedToolSlugs: ['png-to-jpg', 'compress-image', 'crop-photo', 'heic-to-jpg', 'image-to-pdf']
  },

  // 7. Image Compressor
  {
    id: 'compress-image',
    slug: 'compress-image',
    title: 'Image Compressor',
    metaTitle: 'Image Compressor — Reduce JPG, PNG & WebP',
    metaDescription: 'Compress JPG, PNG, and WebP images up to 85% without noticeable quality loss. Instant client-side compression with zero file uploads and no limits.',
    shortDesc: 'Shrink JPG, PNG, and WebP images by up to 85% while preserving visual clarity.',
    category: 'compress',
    icon: 'Minimize2',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Compress Image',
    outputExtension: 'jpg',
    isPopular: true,
    steps: [
      { title: 'Upload Image', description: 'Drop your JPG, PNG, or WebP photo into the workspace.' },
      { title: 'Adjust Compression Slider', description: 'Choose your desired balance between file size and image clarity.' },
      { title: 'Download Compressed Photo', description: 'Get your lightweight photo ready for web, email, or apps.' }
    ],
    faqs: [
      { question: 'How much file size reduction can I expect?', answer: 'Most photos achieve a 60% to 85% file size reduction with virtually imperceptible visual difference on standard displays.' },
      { question: 'Are my personal photos kept private?', answer: 'Yes! Compression is performed directly inside your browser memory using HTML5 Canvas. Your images are never sent to external servers.' },
      { question: 'What formats are supported for compression?', answer: 'iLoveTools supports JPG, JPEG, PNG, and WebP image formats.' }
    ],
    editorial: {
      heading: 'Optimize and Compress Images for Faster Websites and Lighter Emails',
      paragraphs: [
        'Oversized images are the leading cause of slow webpage loading, bloated email attachments, and rejected online form submissions. iLoveTools Image Compressor drastically slashes file weights without compromising perceived sharpness.',
        'Utilizing perceptual compression algorithms in client-side Canvas, iLoveTools removes redundant color data and metadata while preserving crisp subject focus and vibrant color reproduction.',
        'Because processing is executed 100% on your device, you enjoy instant compression with zero upload bottlenecks and complete privacy.'
      ],
      features: [
        { title: 'Up to 85% File Shrinkage', desc: 'Drastically cuts megabytes into kilobytes for fast web performance.' },
        { title: 'Interactive Quality Slider', desc: 'Fine-tune the exact balance between file weight and visual fidelity.' },
        { title: 'Multi-Format Support', desc: 'Works seamlessly on JPG, PNG, and modern WebP assets.' },
        { title: 'Total Data Privacy', desc: 'No cloud uploads, keeping private and commercial imagery secure.' }
      ]
    },
    relatedToolSlugs: ['crop-photo', 'png-to-jpg', 'jpg-to-png', 'heic-to-jpg', 'compress-pdf']
  },

  // 8. Compress Image to 50KB
  {
    id: 'compress-image-to-50kb',
    slug: 'compress-image-to-50kb',
    title: 'Compress Image to 50KB',
    metaTitle: 'Compress Image to 50KB — Free Photo Reducer',
    metaDescription: 'Compress JPG, PNG, and WebP images to strictly under 50KB online for free. Perfect for job applications, passports, and visa portals with 100% privacy.',
    shortDesc: 'Shrink photos to strictly under 50KB for job portals, passports, and visa applications.',
    category: 'compress',
    icon: 'Minimize2',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Compress to < 50KB',
    outputExtension: 'jpg',
    isPopular: true,
    steps: [
      { title: 'Upload Your Photo', description: 'Select any JPG, PNG, or WebP photo up to 50MB.' },
      { title: 'Automatic 50KB Optimization', description: 'Our in-browser engine iteratively calibrates quality and dimensions to guarantee output is ≤ 50 KB.' },
      { title: 'Download Guaranteed < 50KB File', description: 'Save your optimized photo ready for instant upload to strict portals.' }
    ],
    faqs: [
      { question: 'Will my image strictly be under 50KB?', answer: 'Yes! Our algorithm iteratively adjusts compression levels and dimensions until the exported file size is strictly under 50 kilobytes.' },
      { question: 'Is this safe for confidential ID, visa, and passport photos?', answer: '100% safe. Every byte is processed locally inside your browser memory. Your personal documents are never transmitted across any server.' },
      { question: 'Which image formats are supported?', answer: 'You can upload JPG, JPEG, PNG, or WebP files. The tool exports a universally compatible JPEG image that passes all recruitment and government portals.' },
      { question: 'Is there any watermark or daily limit?', answer: 'No. iLoveTools is 100% free with unlimited photo compressions and zero watermarks.' }
    ],
    editorial: {
      heading: 'Compress Photos to Strictly Under 50KB for Government Portals & Visa Applications',
      paragraphs: [
        'Government job portals, college admissions, competitive exam forms, and visa applications routinely enforce strict file size ceilings, frequently capping photo uploads at exactly 50KB. Uploading a file even 1 kilobyte over the limit results in immediate form rejection.',
        'Traditional image compressors only offer vague percentage sliders, forcing you to guess and repeatedly re-compress your image until you stumble upon a file size under 50KB. iLoveTools eliminates this guesswork with an automated multi-pass optimization engine.',
        'Because our compression executes entirely in-browser, your sensitive identity cards, passport photos, and signature scans are never uploaded to a third-party cloud server, guaranteeing total confidentiality and instant results.'
      ],
      features: [
        { title: 'Guaranteed ≤ 50KB Ceiling', desc: 'Auto-adjusts quality and resolution to meet strict upload specifications.' },
        { title: '100% In-Browser Privacy', desc: 'Confidential IDs and visa photos never leave your device memory.' },
        { title: 'Zero Signup or Watermarks', desc: 'Unlimited conversions with no daily quotas or hidden subscriptions.' },
        { title: 'Sharp Text & Clear Faces', desc: 'Retains visual clarity and facial details essential for official photo identification.' }
      ]
    },
    relatedToolSlugs: ['compress-image', 'resize-image', 'crop-photo', 'image-to-pdf', 'png-to-jpg']
  },

  // 9. Compress Image to 100KB
  {
    id: 'compress-image-to-100kb',
    slug: 'compress-image-to-100kb',
    title: 'Compress Image to 100KB',
    metaTitle: 'Compress Image to 100KB — Free Photo Reducer',
    metaDescription: 'Compress JPG, PNG, and WebP images to strictly under 100KB online for free. Ideal for job forms, passport photos, and visa portals with 100% privacy.',
    shortDesc: 'Shrink photos to strictly under 100KB for visa portals, passports, and online applications.',
    category: 'compress',
    icon: 'Minimize2',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Compress to < 100KB',
    outputExtension: 'jpg',
    isPopular: true,
    steps: [
      { title: 'Upload Your Photo', description: 'Select any high-resolution JPG, PNG, or WebP photo up to 50MB.' },
      { title: 'Automatic 100KB Calibration', description: 'Our in-browser algorithm balances sharpness and file size to guarantee the output is strictly ≤ 100 KB.' },
      { title: 'Download Guaranteed < 100KB File', description: 'Save your optimized photo ready for submission to government or visa portals.' }
    ],
    faqs: [
      { question: 'Will my image strictly be under 100KB?', answer: 'Yes! The multi-pass engine iteratively tests compression levels and dimensions until the file is guaranteed under 100 kilobytes.' },
      { question: 'Can I use this for US Visa (DS-160) and Schengen visa portals?', answer: 'Yes. Most visa portals enforce strict file size ceilings (often under 100KB or 240KB). This tool guarantees your photo passes the upload validation.' },
      { question: 'Are my personal documents uploaded to a cloud server?', answer: 'No. All compression runs 100% locally in your browser memory. Your confidential photos and IDs never touch external servers.' },
      { question: 'Is it free with no watermarks?', answer: 'Yes, 100% free with unlimited photo compressions, zero account signups, and zero watermarks.' }
    ],
    editorial: {
      heading: 'Reduce Photo Size to Strictly Under 100KB Online for Passports, Visas, and Job Forms',
      paragraphs: [
        'International visa application systems, national passport renewal portals, and civil service recruitment websites frequently impose rigid file size restrictions, rejecting any uploaded photograph larger than 100KB.',
        'Manually re-exporting images in editing software or experimenting with generic percentage sliders often results in blurry text, distorted faces, or files that still exceed the 100KB threshold. iLoveTools resolves this through intelligent multi-pass client-side optimization.',
        'By performing all calculations within local browser memory via HTML5 Canvas, iLoveTools ensures your identity cards, visa photographs, and personal document scans remain completely confidential and never leak to remote servers.'
      ],
      features: [
        { title: 'Guaranteed ≤ 100KB Ceiling', desc: 'Auto-adjusts compression to strictly clear online application upload caps.' },
        { title: '100% In-Browser Security', desc: 'Personal visa photos and IDs never leave your computer or device.' },
        { title: 'High Visual Clarity', desc: 'Preserves sharp facial contours and true-to-life colors for official verification.' },
        { title: 'Zero Signup or Fees', desc: 'Completely free forever with unlimited conversions and no watermarks.' }
      ]
    },
    relatedToolSlugs: ['compress-image-to-50kb', 'compress-image', 'resize-image', 'crop-photo', 'image-to-pdf']
  },

  // 8. Photo Crop & Pixel Resizer
  {
    id: 'crop-photo',
    slug: 'crop-photo',
    title: 'Photo Crop & Pixel Resizer',
    metaTitle: 'Crop Photo & Pixel Resizer — Free Online',
    metaDescription: 'Crop and resize photos to exact pixel dimensions (1:1, 16:9, 4:3, custom). Free, high-speed, and 100% private in-browser image cropping studio.',
    shortDesc: 'Crop, frame, and resize photos to exact pixel dimensions or standard social aspect ratios.',
    category: 'edit',
    icon: 'Crop',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Crop & Resize Photo',
    outputExtension: 'jpg',
    hasPixelEditor: true,
    steps: [
      { title: 'Upload Photo', description: 'Select the image you want to crop or resize.' },
      { title: 'Set Boundary & Aspect Ratio', description: 'Choose square (1:1), 16:9, 4:3, or enter exact pixel dimensions.' },
      { title: 'Download Framed Photo', description: 'Export your pixel-perfect photo ready for publishing.' }
    ],
    faqs: [
      { question: 'Can I set exact pixel dimensions for passport or avatar photos?', answer: 'Yes! You can manually type exact target pixel widths and heights (e.g. 600x600 for US Visa or 1200x630 for social media).' },
      { question: 'What aspect ratio presets are available?', answer: 'We include 1:1 (Square/Instagram), 16:9 (YouTube/HD), 4:3 (Classic Display), and Freeform custom cropping.' }
    ],
    editorial: {
      heading: 'Precision Image Cropping and Pixel-Level Resizing',
      paragraphs: [
        'Whether preparing profile pictures for LinkedIn, thumbnails for YouTube, or conforming to strict passport/visa photo specifications, getting the framing and pixel dimensions right is essential.',
        'iLoveTools provides an intuitive visual bounding box alongside manual pixel inputs for pixel-accurate precision. Easily adjust focal points and aspect ratios in real time.',
        'Operating directly in the browser, your original photos are processed locally without quality-degrading compression or remote data storage.'
      ],
      features: [
        { title: 'Exact Pixel Dimensions', desc: 'Enter specific width and height values in pixels for precise application requirements.' },
        { title: 'Social Media Presets', desc: 'One-click aspect ratio presets including 1:1, 16:9, 4:3, and custom freeform.' },
        { title: 'Real-Time Interactive Preview', desc: 'Instant visual feedback with high-resolution canvas rendering.' },
        { title: 'No Watermarks', desc: 'Export pristine images without intrusive logos or promotional tags.' }
      ]
    },
    relatedToolSlugs: ['compress-image', 'png-to-jpg', 'jpg-to-png', 'heic-to-jpg']
  },

  // 9. Video Compressor
  {
    id: 'compress-video',
    slug: 'compress-video',
    title: 'Video Compressor',
    metaTitle: 'Compress Video Online — Free MP4 Reducer (No Watermark)',
    metaDescription: 'Reduce MP4 video file size online for Discord, email, or web without watermarks. 100% private in-browser compression with zero server upload wait.',
    shortDesc: 'Reduce MP4 and WebM video file size for Discord, email, and social sharing without watermarks.',
    category: 'compress',
    icon: 'Film',
    acceptedFileTypes: '.mp4,.webm,.mov',
    acceptedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Compress Video',
    outputExtension: 'mp4',
    isVideo: true,
    isPopular: true,
    steps: [
      { title: 'Upload Video', description: 'Select an MP4, WebM, or MOV video clip.' },
      { title: 'Re-encode Streams', description: 'Intelligent video downsampling optimizes bitrate and resolution.' },
      { title: 'Download Video', description: 'Save your compressed video ready for instant sharing.' }
    ],
    faqs: [
      { question: 'Is this a free alternative to iLovePDF for video compression?', answer: 'Yes! While iLovePDF specializes in documents and does not compress videos, iLoveTools lets you compress large MP4, WebM, and MOV videos with zero daily file limits and 100% private in-browser encoding.' },
      { question: 'Will the compressed video have a watermark?', answer: 'Never. iLoveTools produces clean, watermark-free videos on every export.' },
      { question: 'Can I compress videos to fit under Discord 25MB or email limits?', answer: 'Yes! The compressor optimizes bitrate to dramatically cut file sizes so clips fit easily into Discord, Slack, and email attachments.' },
      { question: 'Does iLoveTools upload my private videos to a cloud server?', answer: 'No. Video streams are decoded and re-encoded locally inside your browser using client-side WebAssembly.' }
    ],
    editorial: {
      heading: 'Compress Large Videos for Easy Discord, Slack, and Email Sharing',
      paragraphs: [
        'Sharing high-definition mobile recordings or screen captures often results in frustrating "file size too large" errors on Discord, Slack, and email clients. iLoveTools Video Compressor optimizes bitrates and resolutions to fit your clips into standard sharing limits.',
        'Unlike cloud video editors like Clideo or Kapwing that slap ugly watermarks across your video and demand monthly subscriptions, iLoveTools remains 100% free with zero watermarks.',
        'Experience fast local processing that keeps personal home videos, gameplay clips, and confidential meeting recordings completely secure on your computer.'
      ],
      features: [
        { title: 'Discord & Email Optimized', desc: 'Shrinks heavy recordings under common 25MB and 10MB upload limits.' },
        { title: 'Zero Watermark Branding', desc: 'Exports clean, professional video files with no promotional stamps.' },
        { title: 'Client-Side Security', desc: 'Private video recordings never leave your local browser environment.' },
        { title: 'Wide Format Compatibility', desc: 'Supports MP4, WebM, and MOV containers effortlessly.' }
      ]
    },
    relatedToolSlugs: ['mute-video', 'crop-video', 'video-to-mp3', 'video-to-gif']
  },

  // 10. HEIC to JPG Converter
  {
    id: 'heic-to-jpg',
    slug: 'heic-to-jpg',
    title: 'HEIC to JPG Converter',
    metaTitle: 'HEIC to JPG Converter — Free Apple Photos',
    metaDescription: 'Convert Apple iPhone HEIC and HEIF photos into standard high-resolution JPG format online. 100% free, fast, and completely private in your browser.',
    shortDesc: 'Convert Apple iPhone HEIC and HEIF photos to universally compatible JPG format.',
    category: 'convert',
    icon: 'Camera',
    acceptedFileTypes: '.heic,.heif',
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert HEIC to JPG',
    outputExtension: 'jpg',
    isPopular: true,
    steps: [
      { title: 'Upload HEIC Photos', description: 'Select photos taken on iPhone or iPad (.heic format).' },
      { title: 'Decode Image Data', description: 'Decodes Apple High Efficiency Image Container pixels.' },
      { title: 'Download JPG', description: 'Save universal JPG photos compatible with Windows and Android.' }
    ],
    faqs: [
      { question: 'Why does my iPhone take photos in HEIC format?', answer: 'Apple devices use High Efficiency Image Container (HEIC) to save storage space, but Windows PCs, web forms, and Android devices often cannot open HEIC files without converting to JPG.' },
      { question: 'Is photo resolution preserved during HEIC conversion?', answer: 'Yes, full camera resolution and color metadata are retained for high-quality printing and sharing.' }
    ],
    editorial: {
      heading: 'Convert Apple HEIC Photos to Universal High-Resolution JPGs',
      paragraphs: [
        'Apple iOS captures photos in HEIC format to conserve device storage, but sharing these files with Windows users, submitting them to official portals, or importing them into editing tools frequently leads to format incompatibility errors.',
        'iLoveTools HEIC to JPG Converter unpacks Apple HEIC/HEIF image containers and re-encodes them into universally recognized JPEG files that open on any device or operating system.',
        'Enjoy fast in-browser conversion without exposing personal camera rolls to third-party web servers.'
      ],
      features: [
        { title: 'Universal Device Compatibility', desc: 'Makes iPhone photos viewable on Windows, Android, and web portals.' },
        { title: 'Full Camera Resolution', desc: 'Retains 12MP/48MP camera sharpness and vibrant color balance.' },
        { title: 'Complete Privacy', desc: 'Your personal memories and camera roll remain 100% on your device.' },
        { title: 'Unlimited Photo Conversion', desc: 'Convert as many photos as needed without fees or caps.' }
      ]
    },
    relatedToolSlugs: ['compress-image', 'jpg-to-png', 'crop-photo', 'image-to-pdf']
  },

  // 11. Word to PDF Converter
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    title: 'Word to PDF Converter',
    metaTitle: 'Word Doc to PDF Converter Free — MS Word to PDF Conversion',
    metaDescription: 'Convert Word doc to PDF online for free. Clean MS Word to PDF document conversion with zero file size limits and 100% private in-browser security.',
    shortDesc: 'Convert Microsoft Word (.docx, .doc) documents into clean, printable PDF documents.',
    category: 'pdf',
    icon: 'FileType',
    acceptedFileTypes: '.docx,.doc',
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to PDF',
    outputExtension: 'pdf',
    steps: [
      { title: 'Upload Word Document', description: 'Drop your .docx or .doc file into the converter.' },
      { title: 'Compile Document', description: 'Renders typography, margins, and headings into a fixed layout.' },
      { title: 'Download PDF', description: 'Download your standardized, un-editable PDF document.' }
    ],
    faqs: [
      { question: 'Is this MS Word to PDF converter completely free?', answer: 'Yes! iLoveTools offers 100% free Word doc to PDF conversion with no subscriptions, watermarks, or daily task limits.' },
      { question: 'Will my fonts and margins stay identical on other computers?', answer: 'Yes! Converting to PDF locks your formatting in place so it looks identical on any PC, Mac, phone, or printer.' },
      { question: 'Are confidential legal documents safe?', answer: 'Yes. All parsing happens locally in your browser. Confidential client agreements and resumes are never transmitted over the internet.' }
    ],
    editorial: {
      heading: 'Lock Document Formatting by Converting Word (.docx) to PDF',
      paragraphs: [
        'Sharing Microsoft Word documents across different operating systems often breaks fonts, shifts margins, and displaces images. Converting to PDF creates a locked digital document that prints and displays identically everywhere.',
        'iLoveTools transforms Word (.docx) files into standardized PDF documents quickly and securely without requiring Microsoft Office or third-party cloud printers.',
        'Whether preparing formal resumes, business proposals, or academic papers, iLoveTools delivers reliable PDF generation with zero privacy trade-offs.'
      ],
      features: [
        { title: 'Locked Visual Geometry', desc: 'Prevents unwanted font shifts and margin displacement across devices.' },
        { title: 'Universal Print Compatibility', desc: 'Generates print-ready PDFs formatted for standard letter and A4 paper.' },
        { title: 'Client-Side Document Shield', desc: 'Contracts and resumes remain confidential on your device.' },
        { title: 'No Installation Required', desc: 'Convert Word documents on any browser without software installation.' }
      ]
    },
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-excel', 'compress-pdf', 'merge-pdf', 'image-to-pdf']
  },

  // 12. Video to MP3 Converter
  {
    id: 'video-to-mp3',
    slug: 'video-to-mp3',
    title: 'Video to MP3 Converter',
    metaTitle: 'MP3 from Video Online — Free Audio Extractor for MP4',
    metaDescription: 'Extract MP3 from video online for free. Fast, clean in-browser audio extraction from MP4, WebM, and MOV with zero cloud uploads and no watermarks.',
    shortDesc: 'Extract high-quality MP3 audio tracks from MP4, WebM, and MOV video recordings.',
    category: 'media',
    icon: 'Music',
    acceptedFileTypes: '.mp4,.webm,.mov,.avi',
    acceptedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Extract MP3 Audio',
    outputExtension: 'mp3',
    isVideo: true,
    steps: [
      { title: 'Upload Video', description: 'Select the video with the audio track you want to extract.' },
      { title: 'Demux Audio Stream', description: 'Extracts the underlying sound channel without quality degradation.' },
      { title: 'Download MP3', description: 'Save your clean audio file for podcasts, music, or transcription.' }
    ],
    faqs: [
      { question: 'How do I extract MP3 from video online for free?', answer: 'Simply upload your MP4, WebM, or MOV video file to iLoveTools, click Extract MP3 Audio, and download your high-fidelity MP3 track instantly with zero server uploads.' },
      { question: 'Can I extract audio from lecture and conference recordings?', answer: 'Yes! Upload any video file and iLoveTools will extract the voice track into a lightweight MP3 audio file.' },
      { question: 'Is audio fidelity preserved?', answer: 'Yes, original sample rates and bitrates are maintained for crisp sound quality.' }
    ],
    editorial: {
      heading: 'Extract Clear Audio Tracks from Video Files in Seconds',
      paragraphs: [
        'Whether extracting an interview track for a podcast, stripping background audio from a presentation, or isolating music from a video clip, converting video to MP3 simplifies your workflow.',
        'iLoveTools extracts audio channels from MP4, WebM, and MOV video files directly in your browser, generating standalone MP3 audio files without re-encoding delays.',
        'Save device storage by keeping just the audio tracks from lengthy conference recordings, voice notes, and webinars.'
      ],
      features: [
        { title: 'Crisp Audio Extraction', desc: 'Isolates audio channels cleanly with high fidelity.' },
        { title: 'Significant Storage Savings', desc: 'Audio files take up a fraction of large video file sizes.' },
        { title: 'Local Media Processing', desc: 'Processes streams inside browser memory with zero server uploads.' },
        { title: 'Universal MP3 Format', desc: 'Plays on any phone, car stereo, media player, or transcription tool.' }
      ]
    },
    relatedToolSlugs: ['mute-video', 'compress-video', 'video-to-gif', 'crop-video']
  },

  // 13. PDF Compressor
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    title: 'PDF Compressor',
    metaTitle: 'Compress PDF Online — Reduce File Size Free',
    metaDescription: 'Reduce large PDF document file sizes online without losing text or image clarity. 100% free, unlimited, and private with local browser processing.',
    shortDesc: 'Reduce large PDF document sizes for faster email delivery and upload portals.',
    category: 'compress',
    icon: 'FileArchive',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Compress PDF',
    outputExtension: 'pdf',
    isPopular: true,
    steps: [
      { title: 'Upload PDF', description: 'Choose your oversized PDF document.' },
      { title: 'Optimize Objects', description: 'Recompresses embedded imagery and removes redundant stream overhead.' },
      { title: 'Download Slim PDF', description: 'Download your optimized, email-friendly PDF.' }
    ],
    faqs: [
      { question: 'Will text clarity be affected by PDF compression?', answer: 'No. Vector fonts, typography, and text outlines remain 100% sharp and crisp.' },
      { question: 'Will my PDF meet email size limits (under 25MB)?', answer: 'Yes, our optimization strips unneeded font subsets and optimizes heavy scans to easily fit within email constraints.' }
    ],
    editorial: {
      heading: 'Reduce PDF File Size for Fast Email Attachments and Portal Uploads',
      paragraphs: [
        'Scanned documents, digital portfolios, and multi-page reports frequently exceed the 10MB or 25MB upload limits enforced by government portals, university admissions, and corporate email servers.',
        'iLoveTools PDF Compressor optimizes internal document streams, deduplicates font subsets, and re-encodes embedded image assets to dramatically shrink PDF sizes while preserving crisp text readability.',
        'Because iLoveTools operates 100% client-side, your confidential tax filings, academic transcripts, and legal paperwork never leave your device.'
      ],
      features: [
        { title: 'Crisp Text Preservation', desc: 'Optimizes file weight without compromising vector typography or legal readability.' },
        { title: 'Portal Ready', desc: 'Ensures files pass strict upload limits on job applications and portal forms.' },
        { title: 'Local Client Security', desc: 'Confidential documents are never saved on third-party servers.' },
        { title: 'Completely Free', desc: 'No daily task throttling or paywalls after two compressions.' }
      ]
    },
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'pdf-to-excel', 'pdf-to-word', 'image-to-pdf']
  },

  // 14. Video Crop & Pixel Resizer
  {
    id: 'crop-video',
    slug: 'crop-video',
    title: 'Crop Video Without Watermark',
    metaTitle: 'Crop Video Online Without Watermark — Screen Size & Height',
    metaDescription: 'Crop video online without watermark. Easily crop video screen size, width, and height for MP4 and WebM. 100% free in-browser tool with zero file uploads.',
    shortDesc: 'Crop, reposition, and resize videos to exact aspect ratios without watermarks for YouTube, Reels, and TikTok.',
    category: 'edit',
    icon: 'Maximize',
    acceptedFileTypes: '.mp4,.webm',
    acceptedMimeTypes: ['video/mp4', 'video/webm'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Crop & Resize Video',
    outputExtension: 'mp4',
    isVideo: true,
    steps: [
      { title: 'Upload Video', description: 'Select the video clip you want to re-frame.' },
      { title: 'Choose Framing & Ratio', description: 'Select 9:16 for TikTok/Reels, 1:1 for square, or 16:9 for landscape.' },
      { title: 'Download Cropped Video', description: 'Export your framed clip with zero watermarks.' }
    ],
    faqs: [
      { question: 'Can I crop video online without watermark on iLoveTools?', answer: 'Yes, 100%. Unlike tools like Clideo or Kapwing that force watermarks, iLoveTools crops video online completely free with zero watermark stamps.' },
      { question: 'How do I crop video screen size or height online?', answer: 'Select your video file, drag the interactive crop box or select an exact aspect ratio (16:9 for YouTube, 9:16 for TikTok/Reels, or 1:1), and click Crop Video to export your exact dimensions instantly.' },
      { question: 'Can I crop horizontal video into vertical 9:16 for TikTok or Instagram Reels?', answer: 'Yes! Select the 9:16 aspect ratio preset to perfectly frame subjects for mobile social feeds.' },
      { question: 'Is there any watermark on the exported video?', answer: 'No. Unlike other online video editors, iLoveTools never places watermarks on your videos.' }
    ],
    editorial: {
      heading: 'Frame and Resize Videos for Modern Social Media Formats',
      paragraphs: [
        'Repurposing horizontal 16:9 landscape videos for vertical 9:16 mobile feeds (like Instagram Reels, TikTok, and YouTube Shorts) requires precise framing to keep the subject centered and engaging.',
        'iLoveTools Video Crop tool lets you reposition boundaries and select tailored aspect ratios with zero watermark branding.',
        'Process your video clips directly in the browser with fast hardware acceleration and total privacy.'
      ],
      features: [
        { title: 'Social Aspect Ratios', desc: 'Presets for 9:16 (Vertical Reels/Shorts), 1:1 (Square), and 16:9 (Landscape).' },
        { title: 'Zero Watermark Stamps', desc: 'Clean, professional video exports ready for immediate publishing.' },
        { title: 'In-Browser Decoding', desc: 'Video data remains on your local machine with zero cloud exposure.' },
        { title: 'High-Resolution Export', desc: 'Preserves sharp video quality and color grading.' }
      ]
    },
    relatedToolSlugs: ['mute-video', 'compress-video', 'video-to-mp3', 'video-to-gif']
  },

  // 15. Merge PDF
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    title: 'Merge PDF',
    metaTitle: 'Merge PDF Online — Combine Multiple PDFs',
    metaDescription: 'Combine multiple PDF documents into one unified file in seconds. Drag-and-drop reordering, 100% free, unlimited pages, and completely private in-browser.',
    shortDesc: 'Combine multiple PDF documents, receipts, and scans into one unified document.',
    category: 'pdf',
    icon: 'Layers',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Merge PDFs into One',
    outputExtension: 'pdf',
    isPopular: true,
    steps: [
      { title: 'Select Multiple PDFs', description: 'Upload two or more PDF files from your device.' },
      { title: 'Arrange Page Sequence', description: 'Reorder files in the exact sequence you want them to appear.' },
      { title: 'Download Combined PDF', description: 'Save your consolidated, multi-page PDF document.' }
    ],
    faqs: [
      { question: 'Can I reorder documents before merging?', answer: 'Yes! You can re-arrange the order of your documents so pages appear in the exact desired sequence.' },
      { question: 'Is there a limit to how many PDFs I can merge at once?', answer: 'No artificial limits! You can combine multiple documents without paywalls or restrictive caps.' }
    ],
    editorial: {
      heading: 'Combine Multiple PDF Files into One Organized Document',
      paragraphs: [
        'Managing separate PDF receipts, contract appendices, and project reports creates confusion and disorganization. Merging related documents into a single sequential PDF streamlines distribution and archival.',
        'iLoveTools Merge PDF tool allows you to upload multiple files, arrange their order, and combine them into a single coherent document in seconds.',
        'All merging operations take place in client-side memory using high-speed PDF-lib WebAssembly, keeping sensitive client dossiers and financial statements completely private.'
      ],
      features: [
        { title: 'Intuitive Drag Reordering', desc: 'Arrange documents into the exact chronological order required.' },
        { title: 'Unlimited Document Merging', desc: 'Merge as many PDF files as your device memory allows with zero fees.' },
        { title: 'Zero Cloud Storage Risk', desc: 'Files are merged in local browser memory and never uploaded to remote servers.' },
        { title: 'Preserves Bookmarks & Formatting', desc: 'Retains embedded fonts, vector graphics, and page structures intact.' }
      ]
    },
    relatedToolSlugs: ['split-pdf', 'compress-pdf', 'rotate-pdf', 'watermark-pdf', 'image-to-pdf']
  },

  // 16. Split PDF
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    title: 'Split PDF',
    metaTitle: 'Split PDF Online — Extract Pages for Free',
    metaDescription: 'Extract individual pages or custom page ranges from any PDF document online. 100% free, instant, and client-side with zero files uploaded to servers.',
    shortDesc: 'Extract specific pages or page ranges from large multi-page PDF documents.',
    category: 'pdf',
    icon: 'Scissors',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Split & Extract Pages',
    outputExtension: 'pdf',
    steps: [
      { title: 'Upload PDF', description: 'Select the document you want to split or extract from.' },
      { title: 'Select Pages or Range', description: 'Pick specific page numbers or specify a page range (e.g. pages 2 to 5).' },
      { title: 'Download Extracted PDF', description: 'Download your new lightweight, focused PDF document.' }
    ],
    faqs: [
      { question: 'Can I extract a single page from a 100-page document?', answer: 'Yes! Simply select the single page you need and download it as an independent PDF file.' },
      { question: 'Are extracted pages re-compressed or degraded?', answer: 'No. Page extraction is completely lossless, retaining 100% of the original vector text and image quality.' }
    ],
    editorial: {
      heading: 'Extract Specific Pages and Chapters from Large PDF Documents',
      paragraphs: [
        'Sharing an entire 50-page contract or textbook when a colleague only needs two specific pages is inefficient and risks exposing confidential clauses. Splitting your PDF lets you extract only the relevant sections.',
        'With iLoveTools Split PDF, you can specify individual pages or custom ranges (such as pages 5 through 12) and extract them into a clean, standalone PDF file.',
        'Because iLoveTools runs locally on your workstation, sensitive medical charts, legal agreements, and corporate filings remain private and secure.'
      ],
      features: [
        { title: 'Custom Range Selection', desc: 'Extract single pages, disjointed selections, or contiguous page ranges.' },
        { title: 'Lossless Extraction', desc: 'Maintains pristine original resolution, vector assets, and formatting.' },
        { title: 'Private & Secure', desc: 'No files are transmitted to or stored on remote cloud servers.' },
        { title: 'No Subscription Gates', desc: 'Split as many documents as needed without payment or account creation.' }
      ]
    },
    relatedToolSlugs: ['merge-pdf', 'compress-pdf', 'rotate-pdf', 'pdf-to-jpg']
  },

  // 17. Rotate PDF
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    title: 'Rotate PDF',
    metaTitle: 'Rotate PDF Online — Permanently Rotate Pages',
    metaDescription: 'Rotate individual or all PDF pages 90, 180, or 270 degrees permanently. 100% free, instant, and secure with zero server uploads and live preview.',
    shortDesc: 'Permanently rotate upside down or sideways PDF pages by 90°, 180°, or 270°.',
    category: 'pdf',
    icon: 'RotateCw',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Rotate PDF Pages',
    outputExtension: 'pdf',
    steps: [
      { title: 'Upload PDF', description: 'Select the document containing misaligned or sideways pages.' },
      { title: 'Choose Rotation Angle', description: 'Rotate clockwise by 90°, 180°, or 270° with a single click.' },
      { title: 'Save Rotated PDF', description: 'Download your permanently corrected PDF document.' }
    ],
    faqs: [
      { question: 'Will the rotation be permanent when opened on other computers?', answer: 'Yes! The internal page orientation metadata is permanently rewritten, ensuring pages open correctly on any device or PDF reader.' },
      { question: 'Does rotating a PDF degrade its quality?', answer: 'Not at all. Rotation modifies coordinate orientation matrices without touching the underlying vector text or image data.' }
    ],
    editorial: {
      heading: 'Permanently Fix Sideways and Upside-Down Scanned PDF Pages',
      paragraphs: [
        'Document scanners and smartphone camera scanners often produce PDFs with pages flipped sideways or completely upside-down. Temporary view rotations in standard readers reset upon closing, creating a poor impression for clients.',
        'iLoveTools permanently rewrites the orientation matrix of your PDF pages, ensuring that every recipient sees your documents right-side up regardless of their operating system or PDF reader software.',
        'Everything is handled in-browser with zero file uploads, keeping your financial statements and identity records safe.'
      ],
      features: [
        { title: 'Permanent Orientation Fix', desc: 'Modifies underlying PDF metadata so pages stay properly aligned permanently.' },
        { title: 'Flexible Angle Selection', desc: 'Supports 90° clockwise, 180° upside-down, and 270° counter-clockwise rotations.' },
        { title: 'Zero Quality Loss', desc: 'Modifies page matrices without altering text rendering or image data.' },
        { title: 'Total Privacy Shield', desc: 'Processed locally in browser memory without server data transmission.' }
      ]
    },
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'compress-pdf', 'watermark-pdf']
  },

  // 18. PDF to JPG
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG Converter',
    metaTitle: 'PDF to JPG Converter — Extract PDF to Images',
    metaDescription: 'Convert PDF pages into high-resolution JPG images. 100% free, private, and processed locally in your browser with zero data ever sent to servers.',
    shortDesc: 'Convert PDF pages into high-resolution JPG photos for presentations and sharing.',
    category: 'convert',
    icon: 'Image',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert PDF to JPG',
    outputExtension: 'jpg',
    steps: [
      { title: 'Upload PDF', description: 'Drop your multi-page or single-page PDF document.' },
      { title: 'Rasterize Pages', description: 'Renders vector text and images into crisp, high-resolution JPEG pixels.' },
      { title: 'Download Image', description: 'Save your converted image ready for presentations and web sharing.' }
    ],
    faqs: [
      { question: 'Can I insert the converted JPG into PowerPoint or Word?', answer: 'Yes! Converted JPG images can be easily embedded into Word, PowerPoint, Keynote, or social media posts.' },
      { question: 'Is text rendered clearly in the JPG output?', answer: 'Yes, our rasterizer renders typography with subpixel antialiasing for maximum sharpness.' }
    ],
    editorial: {
      heading: 'Convert PDF Document Pages into High-Resolution JPEG Images',
      paragraphs: [
        'When you need to embed a chart, certificate, or infographic from a PDF into a presentation or social post, dealing with fixed PDF formatting can be difficult. Converting PDF pages to JPEG images provides universal image compatibility.',
        'iLoveTools renders your PDF pages into sharp, high-resolution JPG files with crisp vector smoothing and accurate color reproduction.',
        'All rendering is performed inside your browser via local Canvas graphics engines, ensuring complete confidentiality for private certificates and reports.'
      ],
      features: [
        { title: 'Sharp Text Rasterization', desc: 'Anti-aliased rendering guarantees clear typography and sharp graphics.' },
        { title: 'Universal Image Sharing', desc: 'Perfect for sharing on Instagram, LinkedIn, or embedding in presentations.' },
        { title: 'Private In-Browser Render', desc: 'No remote document parsing or cloud storage risks.' },
        { title: 'Free & Unrestricted', desc: 'Convert as many PDF pages as needed with no daily limits.' }
      ]
    },
    relatedToolSlugs: ['image-to-pdf', 'compress-image', 'split-pdf', 'compress-pdf']
  },

  // 19. Video to GIF
  {
    id: 'video-to-gif',
    slug: 'video-to-gif',
    title: 'Video to GIF Converter',
    metaTitle: 'MP4 to Loop GIF Converter — Free Animated GIF Maker',
    metaDescription: 'Convert MP4 to looping animated GIF online for free. Lightweight, watermark-free GIF maker processed directly in your browser with zero cloud uploads.',
    shortDesc: 'Turn short video clips into animated, looping GIFs for memes, Slack, and presentations.',
    category: 'media',
    icon: 'Film',
    acceptedFileTypes: '.mp4,.webm',
    acceptedMimeTypes: ['video/mp4', 'video/webm'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert to GIF',
    outputExtension: 'gif',
    isVideo: true,
    steps: [
      { title: 'Upload Video Clip', description: 'Select a short MP4 or WebM video file.' },
      { title: 'Frame Extraction & Paletting', description: 'Samples video frames and builds an optimized color palette.' },
      { title: 'Download Looping GIF', description: 'Save your animated GIF ready for Discord, Slack, and web.' }
    ],
    faqs: [
      { question: 'How do I convert an MP4 to a loop GIF online?', answer: 'Upload your MP4 video to iLoveTools Video to GIF tool, and our client-side engine will automatically extract frames and output an infinite looping GIF ready for Discord, Slack, and web sharing.' },
      { question: 'Will the generated GIF loop automatically?', answer: 'Yes, all generated GIFs loop infinitely by default, making them perfect for Slack reactions and memes.' },
      { question: 'Is there a watermark on the created GIF?', answer: 'No. iLoveTools generates completely clean GIFs with zero watermarks or logos.' }
    ],
    editorial: {
      heading: 'Turn Video Clips into Looping Animated GIFs for Slack and Social Media',
      paragraphs: [
        'Animated GIFs are the universal language of online communication, team messaging in Slack, and social media reactions. Creating clean, lightweight GIFs from screen recordings or funny clips should be quick and frictionless.',
        'iLoveTools extracts key video frames, calculates an optimized color palette, and compiles a smooth looping GIF directly in your browser without watermarks.',
        'Enjoy fast client-side rendering with zero file uploads or account requirements.'
      ],
      features: [
        { title: 'Infinite Looping by Default', desc: 'Perfect for chat reactions, GitHub documentation, and social feeds.' },
        { title: 'Color Palette Optimization', desc: 'Preserves visual clarity while keeping GIF file sizes manageable.' },
        { title: 'Watermark-Free Export', desc: 'Exports clean animations without promotional stamps or badges.' },
        { title: 'Instant Browser Processing', desc: 'No waiting in cloud rendering queues.' }
      ]
    },
    relatedToolSlugs: ['mute-video', 'compress-video', 'crop-video', 'video-to-mp3']
  },

  // 20. Remove Audio (Mute Video)
  {
    id: 'mute-video',
    slug: 'mute-video',
    title: 'Remove Audio',
    metaTitle: 'Remove Audio from Video — Free Online Muter',
    metaDescription: 'Mute MP4, WebM, and MOV videos online. Remove background noise and audio tracks with zero watermarks, 100% free, and completely private in-browser.',
    shortDesc: 'Mute and remove unwanted audio tracks, background noise, or speech from video files.',
    category: 'media',
    icon: 'VolumeX',
    acceptedFileTypes: '.mp4,.webm,.mov',
    acceptedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Mute & Remove Audio',
    outputExtension: 'mp4',
    isVideo: true,
    steps: [
      { title: 'Upload Video', description: 'Select the video clip containing audio you want to remove.' },
      { title: 'Instant Audio Stripping', description: 'The audio stream is instantly detached while preserving pristine video visual quality.' },
      { title: 'Download Muted Video', description: 'Download your clean, completely silent video file.' }
    ],
    faqs: [
      { question: 'Does removing audio reduce the video image quality?', answer: 'No! The video stream is demuxed cleanly, preserving 100% of the original video bitrate, resolution, and color.' },
      { question: 'Will there be a watermark added to my muted video?', answer: 'Never. iLoveTools produces clean, watermark-free videos on every export.' },
      { question: 'How fast is the audio removal process?', answer: 'Because the video stream does not need re-encoding, audio removal happens almost instantly in your browser!' }
    ],
    editorial: {
      heading: 'Remove Background Noise and Soundtracks from Videos Without Watermarks',
      paragraphs: [
        'Accidental background chatter, loud wind noise, or copyrighted music can ruin an otherwise great video clip. Muting or stripping the audio track lets you clean up clips before posting to social media or adding voiceovers.',
        'iLoveTools detaches the audio track from your MP4, WebM, or MOV video directly in your browser. Because the video track is demuxed without re-encoding, processing is nearly instantaneous and visual quality is 100% preserved.',
        'Best of all, iLoveTools never applies watermarks or limits your downloads, keeping your footage clean and professional.'
      ],
      features: [
        { title: 'Zero Visual Degradation', desc: 'Strips audio streams without recompressing video pixels.' },
        { title: 'Zero Watermarks', desc: 'Download clean, professional video files suitable for commercial publishing.' },
        { title: 'Lightning-Fast Execution', desc: 'No lengthy re-encoding queues; processes in seconds inside your browser.' },
        { title: 'Private & Secure', desc: 'Personal and proprietary video recordings never leave your workstation.' }
      ]
    },
    relatedToolSlugs: ['compress-video', 'crop-video', 'video-to-mp3', 'video-to-gif']
  },

  // 21. Watermark PDF
  {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    title: 'Watermark PDF',
    metaTitle: 'Watermark PDF Online — Add Text & Stamp Free',
    metaDescription: 'Add customizable text watermarks, confidentiality stamps, and copyright marks to your PDF pages online. 100% free, instant, and private in-browser.',
    shortDesc: 'Add customizable confidentiality stamps, copyright text, or draft watermarks to PDF pages.',
    category: 'pdf',
    icon: 'Stamp',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Add Watermark to PDF',
    outputExtension: 'pdf',
    steps: [
      { title: 'Upload PDF', description: 'Select the document you want to watermark.' },
      { title: 'Customize Stamp', description: 'Choose your watermark text (e.g. CONFIDENTIAL, DRAFT), opacity, color, and angle.' },
      { title: 'Download Stamped PDF', description: 'Download your protected, professional PDF document.' }
    ],
    faqs: [
      { question: 'Can I customize the watermark text and opacity?', answer: 'Yes! You can enter custom text like CONFIDENTIAL, COPY, or your company name, and adjust opacity so background text remains readable.' },
      { question: 'Does the watermark apply across every page in the document?', answer: 'Yes, the watermark is cleanly applied across all pages with uniform placement.' }
    ],
    editorial: {
      heading: 'Protect Intellectual Property and Mark Confidential Documents',
      paragraphs: [
        'Before distributing sensitive financial projections, contract drafts, or proprietary creative work, applying clear watermarks like "CONFIDENTIAL", "DRAFT", or "DO NOT SHARE" prevents unauthorized leaks and protects ownership.',
        'iLoveTools Watermark PDF allows you to add customizable text stamps with adjustable opacity, rotation angles, and colors across every page of your document.',
        'Because all watermarking occurs locally inside your browser memory, your confidential drafts and agreements are never exposed to external cloud servers.'
      ],
      features: [
        { title: 'Custom Text & Opacity', desc: 'Personalize wording, font size, color, and transparency for subtle or bold stamping.' },
        { title: 'Multi-Page Uniformity', desc: 'Applies watermarks consistently across all pages of your PDF document.' },
        { title: 'Complete Privacy Guarantee', desc: 'Confidential business proposals and NDAs are processed locally.' },
        { title: 'Instant In-Browser Render', desc: 'Fast client-side stamping with zero download wait time.' }
      ]
    },
    relatedToolSlugs: ['rotate-pdf', 'merge-pdf', 'split-pdf', 'compress-pdf']
  },

  // 22. Link to QR Code Generator
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    title: 'Link to QR Code Generator',
    metaTitle: 'QR Code Generator — Free Custom QR Codes',
    metaDescription: 'Generate high-resolution QR codes for websites, links, Wi-Fi, and text. Download as crisp PNG up to 1200px. 100% free with no expiration or limits.',
    shortDesc: 'Generate clean, high-resolution QR codes for websites, restaurant menus, and Wi-Fi networks.',
    category: 'productivity',
    icon: 'QrCode',
    acceptedFileTypes: '.txt',
    maxFileSizeMB: 5000,
    actionButtonText: 'Generate QR Code',
    outputExtension: 'png',
    steps: [
      { title: 'Enter URL or Text', description: 'Paste your website link, social profile, or plain text.' },
      { title: 'Generate Instant Matrix', description: 'Instant generation with built-in error correction.' },
      { title: 'Download High-Res PNG', description: 'Save your print-ready QR code image.' }
    ],
    faqs: [
      { question: 'Do these QR codes ever expire?', answer: 'Never! These are static QR codes that encode your destination directly into the matrix. They work forever with zero recurring fees.' },
      { question: 'Can I print these QR codes on posters and flyers?', answer: 'Yes! The generated PNG is high-resolution with high contrast, ensuring reliable scanning by all modern smartphone cameras.' }
    ],
    editorial: {
      heading: 'Generate Permanent, High-Resolution QR Codes with No Expiration',
      paragraphs: [
        'Many online QR code generators use shady redirection tricks that stop working after 14 days unless you purchase an expensive monthly subscription. iLoveTools generates direct, static QR codes that encode your data permanently.',
        'Whether printing marketing flyers, business cards, restaurant menus, or Wi-Fi credentials, our generator produces crisp, high-contrast QR codes with built-in Reed-Solomon error correction for reliable scanning.',
        'Completely free, client-side, and permanent: your links never expire.'
      ],
      features: [
        { title: 'Never Expiring Static Codes', desc: 'Direct URL encoding means your QR codes will scan forever without subscriptions.' },
        { title: 'High-Resolution Export', desc: 'Crisp PNG files ready for professional printing on flyers, cards, and packaging.' },
        { title: 'Built-In Error Correction', desc: 'Ensures reliable scanning even if the printed code is slightly scratched or skewed.' },
        { title: 'Instant In-Browser Generation', desc: 'Generates in real time with zero server tracking or telemetry.' }
      ]
    },
    relatedToolSlugs: ['password-generator', 'word-counter', 'case-converter']
  },

  // 23. Password Generator
  {
    id: 'password-generator',
    slug: 'password-generator',
    title: 'Password Generator',
    metaTitle: 'Password Generator — Strong & Secure Passwords',
    metaDescription: 'Generate ultra-secure, cryptographically strong random passwords with customizable symbols, numbers, and uppercase letters. 100% private in-browser.',
    shortDesc: 'Generate cryptographically strong, random passwords to protect online accounts.',
    category: 'productivity',
    icon: 'Key',
    acceptedFileTypes: '.txt',
    maxFileSizeMB: 5000,
    actionButtonText: 'Generate Secure Password',
    outputExtension: 'txt',
    steps: [
      { title: 'Set Desired Length', description: 'Choose your password length (12 to 64 characters recommended).' },
      { title: 'Toggle Character Sets', description: 'Include uppercase, lowercase, numbers, and special symbols.' },
      { title: 'Copy with One Click', description: 'Copy your ultra-secure password directly to your clipboard.' }
    ],
    faqs: [
      { question: 'Are generated passwords saved on your server?', answer: 'Never. Passwords are generated using your browser native window.crypto API. They exist solely in your local RAM and are never transmitted anywhere.' },
      { question: 'What makes a password cryptographically secure?', answer: 'Using high entropy with 16+ characters combined with mixed case, numbers, and symbols makes passwords mathematically immune to brute-force dictionary attacks.' }
    ],
    editorial: {
      heading: 'Generate Cryptographically Strong Passwords Resistant to Brute Force',
      paragraphs: [
        'Weak and reused passwords are the root cause of over 80% of data breaches. Protecting your email, banking, and cloud credentials requires generating unique, high-entropy passwords for every service.',
        'iLoveTools Password Generator uses the browser native window.crypto CSPRNG (Cryptographically Secure Pseudorandom Number Generator) to produce truly random characters that resist modern cracking techniques.',
        'Because code runs strictly in local client memory, generated passwords are never logged, tracked, or sent across any network.'
      ],
      features: [
        { title: 'Cryptographic Security (CSPRNG)', desc: 'Leverages browser-native cryptographic random number generators for true entropy.' },
        { title: 'Customizable Rules', desc: 'Easily toggle uppercase, lowercase, numbers, symbols, and avoid ambiguous characters.' },
        { title: 'One-Click Clipboard Copy', desc: 'Quickly transfer passwords into 1Password, Bitwarden, or your browser vault.' },
        { title: 'Zero Server Storage', desc: 'Passwords exist solely in local volatile memory and disappear upon closing the tab.' }
      ]
    },
    relatedToolSlugs: ['qr-code-generator', 'word-counter', 'case-converter']
  },

  // 24. Word & Character Counter
  {
    id: 'word-counter',
    slug: 'word-counter',
    title: 'Word & Character Counter',
    metaTitle: 'Word Counter — Real-Time Text Analyzer Tool',
    metaDescription: 'Count words, characters, sentences, paragraphs, and reading time in real-time. 100% free, private, and instant in-browser text analysis studio.',
    shortDesc: 'Count words, characters, sentences, and estimated reading time in real time.',
    category: 'productivity',
    icon: 'AlignLeft',
    acceptedFileTypes: '.txt,.doc,.docx,.pdf',
    maxFileSizeMB: 5000,
    actionButtonText: 'Count Words & Stats',
    outputExtension: 'txt',
    steps: [
      { title: 'Paste Text or Drop File', description: 'Provide the content you want analyzed.' },
      { title: 'Calculate Metrics', description: 'Instant calculation of words, characters, and reading time.' },
      { title: 'Export Summary', description: 'Review your detailed text statistics report.' }
    ],
    faqs: [
      { question: 'How is estimated reading time calculated?', answer: 'Based on the scientific average human reading speed of 220 words per minute for general non-fiction text.' },
      { question: 'Can I use this for social media character limits (X/Twitter, LinkedIn)?', answer: 'Yes! Live character counts help you craft posts that fit perfectly within social platform constraints.' }
    ],
    editorial: {
      heading: 'Real-Time Text Analytics: Word, Character, and Reading Time Metrics',
      paragraphs: [
        'Writing essays, drafting social media copy, or preparing blog posts requires keeping a close eye on word and character constraints. iLoveTools provides instant, live calculations as you type or paste text.',
        'In addition to basic word and character counts (with and without spaces), iLoveTools calculates sentence structures, paragraph counts, and estimated reading times.',
        'All text analysis happens locally inside your browser, ensuring private journal entries, unpublished book drafts, and client correspondence remain strictly confidential.'
      ],
      features: [
        { title: 'Live Real-Time Counts', desc: 'Updates words, characters, and sentences instantly with every keystroke.' },
        { title: 'Estimated Reading Duration', desc: 'Calculates audience reading and speaking times based on standard metrics.' },
        { title: 'Confidentiality Shield', desc: 'Unpublished manuscripts and sensitive essays are never sent to external servers.' },
        { title: 'Clean & Lightweight', desc: 'Zero distractions, zero ads blocking your workspace.' }
      ]
    },
    relatedToolSlugs: ['case-converter', 'password-generator', 'qr-code-generator']
  },

  // 25. Case Converter
  {
    id: 'case-converter',
    slug: 'case-converter',
    title: 'Case Converter',
    metaTitle: 'Case Converter — UPPERCASE, lowercase & Title',
    metaDescription: 'Convert text between UPPERCASE, lowercase, Title Case, sentence case, and camelCase instantly. 100% free, private, and instant in-browser tool.',
    shortDesc: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, and camelCase.',
    category: 'productivity',
    icon: 'Type',
    acceptedFileTypes: '.txt',
    maxFileSizeMB: 5000,
    actionButtonText: 'Convert Text Case',
    outputExtension: 'txt',
    steps: [
      { title: 'Upload or Paste Text', description: 'Supply the text document or snippet.' },
      { title: 'Choose Target Casing', description: 'Select UPPERCASE, lowercase, Title Case, Sentence case, or camelCase.' },
      { title: 'Download Converted Text', description: 'Copy or save your formatted text immediately.' }
    ],
    faqs: [
      { question: 'Does it support special characters and non-English accents?', answer: 'Yes, all Unicode characters, accents, and symbols are fully preserved during casing conversions.' },
      { question: 'What is Title Case best used for?', answer: 'Title Case capitalizes principal words and is ideal for book titles, blog headings, and formal presentations.' }
    ],
    editorial: {
      heading: 'Instantly Reformat Text Between UPPERCASE, lowercase, and Title Case',
      paragraphs: [
        'Accidentally typing in ALL CAPS, needing to format blog headlines in Title Case, or converting text into developer-friendly camelCase for programming variables can be tedious to fix manually.',
        'iLoveTools Case Converter reformats your text with a single click, instantly transforming casing while preserving special characters and punctuation.',
        'Everything executes in client-side memory, keeping personal notes and proprietary code snippets completely secure.'
      ],
      features: [
        { title: 'Comprehensive Casing Formats', desc: 'Supports UPPERCASE, lowercase, Title Case, Sentence case, and camelCase.' },
        { title: 'Accurate Unicode Handling', desc: 'Preserves international accents, punctuation, and formatting symbols.' },
        { title: 'One-Click Transformation', desc: 'Format entire documents or code snippets in milliseconds.' },
        { title: 'Total In-Browser Privacy', desc: 'Text never leaves your device memory.' }
      ]
    },
    relatedToolSlugs: ['word-counter', 'password-generator', 'qr-code-generator']
  },

  // 26. Google Docs to PDF
  {
    id: 'google-docs-to-pdf',
    slug: 'google-docs-to-pdf',
    title: 'Google Docs to PDF Converter',
    metaTitle: 'Google Docs to PDF — Free Link to PDF Export',
    metaDescription: 'Convert any public Google Docs, Sheets, or Slides link into a direct PDF download. 1-click in-browser conversion with zero file size limits and 100% privacy.',
    shortDesc: 'Paste any Google Docs link to instantly download a clean, formatted PDF document.',
    category: 'pdf',
    icon: 'FileText',
    acceptedFileTypes: '.gdoc,.docx,.txt',
    acceptedMimeTypes: ['application/vnd.google-apps.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Export to PDF',
    outputExtension: 'pdf',
    steps: [
      { title: 'Paste Google Docs Link', description: 'Paste the shareable link to any Google Document, Sheet, or Slide.' },
      { title: 'Validate Document ID', description: 'Our system instantly extracts the document ID and validates the export route.' },
      { title: 'Download Clean PDF', description: 'Download your formatted PDF document directly to your device with zero watermark.' }
    ],
    faqs: [
      { question: 'How do I convert a Google Doc to PDF using a link?', answer: 'Simply copy the share link of your Google Document (make sure sharing is set to "Anyone with the link can view"), paste it into the link input box, and click Download PDF.' },
      { question: 'Is my Google Doc uploaded to any server?', answer: 'No. The conversion uses direct in-browser export links connecting your browser straight to Google\'s document export pipeline. No document text or metadata is stored on our servers.' },
      { question: 'Can I export Google Sheets and Google Slides as well?', answer: 'Yes! Our link parser automatically detects whether your link is a Google Doc, Google Sheet, or Google Slide presentation and generates the correct PDF export.' },
      { question: 'Can I also export to Microsoft Word or plain text?', answer: 'Yes, in addition to PDF, we provide direct one-click buttons to download your Google Doc as a Word (.docx) or plain text (.txt) file.' }
    ],
    editorial: {
      heading: 'Instant Google Docs to PDF Conversion via Direct URL',
      paragraphs: [
        'Exporting Google Documents to PDF traditionally requires opening Google Drive, waiting for the heavy web editor to load, navigating to File > Download > PDF Document, and waiting for the export process.',
        'Our Google Docs to PDF Converter streamlines this workflow completely. By pasting your Google Docs link, our tool detects the document ID and requests an instant direct PDF render directly from Google\'s export pipeline without loading the entire Google Docs editor.',
        'Whether you are submitting an academic paper, sending a client contract, or archiving notes, enjoy instant high-resolution PDF generation with zero sign-ups and total privacy.'
      ],
      features: [
        { title: 'Instant Link-to-PDF', desc: 'Convert public and shared Google Docs directly via URL with zero friction.' },
        { title: '100% Private & Direct', desc: 'Downloads directly to your computer with no intermediary server storage.' },
        { title: 'Multiple Export Formats', desc: 'Export as high-resolution PDF, Microsoft Word (.docx), or plain text.' },
        { title: 'Docs, Sheets & Slides', desc: 'Seamlessly supports Google Docs, Google Sheets, and Google Slides links.' }
      ]
    },
    relatedToolSlugs: ['word-to-pdf', 'image-to-pdf', 'merge-pdf', 'compress-pdf']
  },

  // 27. Resize Image
  {
    id: 'resize-image',
    slug: 'resize-image',
    title: 'Resize Image',
    metaTitle: 'Resize Image Online — Change Pixel Dimensions',
    metaDescription: 'Resize JPG, PNG, and WebP images by exact pixel dimensions or percentage with aspect ratio lock. 100% free, private in-browser processing with no limits.',
    shortDesc: 'Resize photo dimensions by pixels (width/height) or percentage with aspect ratio lock.',
    category: 'edit',
    icon: 'Minimize2',
    acceptedFileTypes: '.jpg,.jpeg,.png,.webp',
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Resize Image',
    outputExtension: 'jpg',
    steps: [
      { title: 'Upload Image', description: 'Select any JPG, PNG, or WebP photo to resize.' },
      { title: 'Set Width & Height', description: 'Enter target dimensions in pixels or choose a scaling percentage (25%, 50%, 75%).' },
      { title: 'Download Resized Image', description: 'Save your perfectly scaled image in high resolution with zero upload wait.' }
    ],
    faqs: [
      { question: 'Can I lock the aspect ratio when resizing?', answer: 'Yes! The proportional lock is enabled by default so entering a new width automatically updates the height without stretching or distorting your photo.' },
      { question: 'Will my image be uploaded to any server?', answer: 'Never. iLoveTools resizes images 100% locally in your browser memory using HTML5 Canvas. Your images are never transmitted over the internet.' },
      { question: 'Can I resize by percentage?', answer: 'Yes, you can toggle between exact pixel dimensions (px) and percentage scale (25%, 50%, 75%, 200%).' },
      { question: 'Does resizing reduce file size?', answer: 'Downscaling photo dimensions significantly reduces file size while maintaining sharp clarity, making images ideal for websites, email, and social media.' }
    ],
    editorial: {
      heading: 'Precision Image Resizing Directly in Your Browser',
      paragraphs: [
        'Whether preparing product photos for an ecommerce store, resizing banners for social media, or shrinking vacation pictures for email attachments, changing image dimensions is a vital daily task.',
        'Traditional online image resizers require uploading high-resolution photos to remote servers, waiting in processing queues, and risking personal data leaks. iLoveTools Image Resizer processes everything directly inside your browser using hardware-accelerated Canvas 2D graphics.',
        'Scale images by exact pixel width and height, enforce proportional aspect ratios, or downscale by percentage in milliseconds with zero server latency.'
      ],
      features: [
        { title: 'Exact Pixel Dimensions', desc: 'Specify custom width and height with optional proportional aspect ratio locking.' },
        { title: 'Percentage Scaling', desc: 'Quickly scale down by 25%, 50%, or 75% with a single click.' },
        { title: '100% Local Processing', desc: 'Zero server uploads. Your photos never leave your device memory.' },
        { title: 'No File Size Caps', desc: 'Resize massive high-megapixel camera photos effortlessly.' }
      ]
    },
    relatedToolSlugs: ['compress-image', 'crop-photo', 'png-to-jpg', 'jpg-to-png']
  },

  // 28. Add Page Numbers to PDF
  {
    id: 'add-page-numbers-to-pdf',
    slug: 'add-page-numbers-to-pdf',
    title: 'Add Page Numbers to PDF',
    metaTitle: 'Add Page Numbers to PDF — Number Pages Online',
    metaDescription: 'Stamp clean sequential page numbers onto your PDF document in seconds. Customize position, numbering format (Page X of Y), and skip cover pages.',
    shortDesc: 'Stamp customizable page numbers on every page of your PDF with zero server upload.',
    category: 'pdf',
    icon: 'Layers',
    acceptedFileTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 5000,
    actionButtonText: 'Add Page Numbers',
    outputExtension: 'pdf',
    steps: [
      { title: 'Upload PDF', description: 'Select your multi-page PDF document.' },
      { title: 'Choose Position & Format', description: 'Select numbering position (bottom right, center, etc.) and format ("Page X of Y" or simple numbers).' },
      { title: 'Download Numbered PDF', description: 'Download your professionally numbered PDF document with zero watermark.' }
    ],
    faqs: [
      { question: 'Can I skip numbering the cover page?', answer: 'Yes! Simply check "Do not number first page (cover)" to start numbering from page 2.' },
      { question: 'What page numbering formats are supported?', answer: 'You can choose between "Page 1 of 10", "1 of 10", "1 / 10", or simple digits ("1").' },
      { question: 'Are my confidential documents uploaded to a server?', answer: 'No. iLoveTools processes and stamps PDF files 100% locally in your browser memory using client-side WebAssembly and pdf-lib. No document data is ever uploaded.' },
      { question: 'Can I choose where the page numbers appear?', answer: 'Yes, you can position page numbers in the bottom-right, bottom-center, bottom-left, top-right, top-center, or top-left corners.' }
    ],
    editorial: {
      heading: 'Professional PDF Page Numbering Online Without Uploading Files',
      paragraphs: [
        'Adding sequential page numbers is essential for academic dissertations, legal filings, executive reports, and book manuscripts. Without page numbers, documents appear disorganized and difficult to reference.',
        'iLoveTools Add Page Numbers to PDF stamps precise vector page numbering directly onto your existing PDF layout without altering existing text or rasterizing pages into blurry images.',
        'With custom corner positions, cover-page skipping, and total in-browser privacy, format official documents with complete peace of mind.'
      ],
      features: [
        { title: 'Multiple Positions', desc: 'Place page numbers at bottom-right, bottom-center, bottom-left, or top corners.' },
        { title: 'Flexible Numbering Styles', desc: 'Choose "Page X of Y", "X of Y", or clean standalone digits.' },
        { title: 'Cover Page Protection', desc: 'Easily omit page numbers on the first cover or title page.' },
        { title: '100% Private in Browser', desc: 'Secure local processing with zero server uploads and zero file size limits.' }
      ]
    },
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'compress-pdf', 'watermark-pdf', 'rotate-pdf']
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'convert', label: 'Converters' },
  { id: 'compress', label: 'Compressors' },
  { id: 'edit', label: 'Crop & Pixel' },
  { id: 'pdf', label: 'PDF Utilities' },
  { id: 'media', label: 'Audio & Media' },
  { id: 'productivity', label: 'Productivity' }
] as const;
