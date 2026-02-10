import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TableCell, Table, TableRow, WidthType, ImageRun, convertInchesToTwip } from 'docx';
import PptxGenJS from 'pptxgenjs';
import { saveAs } from 'file-saver';

interface VisualStep {
  label: string;
  imageUrl: string;
}

interface LessonData {
  title: string;
  curriculumArea: string;
  lessonTopic: string;
  learningObjective: string;
  content: string;
  visualSteps?: VisualStep[] | null;
  className?: string;
  createdAt?: string;
}

// Helper to parse markdown content into structured sections
function parseMarkdownContent(content: string): { title: string; text: string }[] {
  const sections: { title: string; text: string }[] = [];
  const lines = content.split('\n');
  let currentTitle = '';
  let currentText: string[] = [];

  for (const line of lines) {
    // Check for headers (## or ###)
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headerMatch) {
      // Save previous section if exists
      if (currentTitle || currentText.length > 0) {
        sections.push({
          title: currentTitle,
          text: currentText.join('\n').trim()
        });
      }
      currentTitle = headerMatch[1];
      currentText = [];
    } else {
      currentText.push(line);
    }
  }

  // Push last section
  if (currentTitle || currentText.length > 0) {
    sections.push({
      title: currentTitle,
      text: currentText.join('\n').trim()
    });
  }

  return sections;
}

// Clean markdown formatting for plain text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/`([^`]+)`/g, '$1') // Code
    .replace(/^- /gm, '• ') // Bullet points
    .replace(/^\d+\.\s/gm, '') // Numbered lists
    .trim();
}

// Export to Word Document
export async function exportToWord(data: LessonData, filename: string = 'lesson-plan'): Promise<void> {
  const sections = parseMarkdownContent(data.content);
  
  const children: Paragraph[] = [];
  
  // Title
  children.push(
    new Paragraph({
      text: data.title || `${data.curriculumArea}: ${data.lessonTopic}`,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Metadata
  if (data.className) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Class: ', bold: true }),
          new TextRun({ text: data.className }),
        ],
        spacing: { after: 100 },
      })
    );
  }
  
  if (data.createdAt) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Created: ', bold: true }),
          new TextRun({ text: new Date(data.createdAt).toLocaleDateString() }),
        ],
        spacing: { after: 100 },
      })
    );
  }
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Subject Area: ', bold: true }),
        new TextRun({ text: data.curriculumArea }),
      ],
      spacing: { after: 100 },
    })
  );
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Topic: ', bold: true }),
        new TextRun({ text: data.lessonTopic }),
      ],
      spacing: { after: 100 },
    })
  );
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Learning Objective: ', bold: true }),
        new TextRun({ text: data.learningObjective }),
      ],
      spacing: { after: 300 },
    })
  );
  
  // Horizontal line
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
      },
      spacing: { after: 300 },
    })
  );
  
  // Content sections
  for (const section of sections) {
    if (section.title) {
      children.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    }
    
    if (section.text) {
      const cleanedText = cleanMarkdown(section.text);
      const lines = cleanedText.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        children.push(
          new Paragraph({
            text: line,
            spacing: { after: 100 },
          })
        );
      }
    }
  }
  
  // Visual Schedule section if available
  if (data.visualSteps && data.visualSteps.length > 0) {
    children.push(
      new Paragraph({
        text: 'Visual Schedule',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );
    
    // List the visual steps
    for (let i = 0; i < data.visualSteps.length; i++) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${i + 1}. `, bold: true }),
            new TextRun({ text: data.visualSteps[i].label }),
          ],
          spacing: { after: 50 },
        })
      );
    }
  }
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

// Export to PowerPoint
export async function exportToPowerPoint(data: LessonData, filename: string = 'lesson-plan'): Promise<void> {
  const pptx = new PptxGenJS();
  
  pptx.title = data.title || `${data.curriculumArea}: ${data.lessonTopic}`;
  pptx.author = 'AET Teacher Portal';
  
  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(data.title || `${data.curriculumArea}: ${data.lessonTopic}`, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.5,
    fontSize: 36,
    bold: true,
    align: 'center',
    color: '1e3a5f',
  });
  
  titleSlide.addText([
    { text: data.curriculumArea, options: { bold: true } },
    { text: ' | ' },
    { text: data.lessonTopic },
  ], {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.5,
    fontSize: 18,
    align: 'center',
    color: '666666',
  });
  
  if (data.className) {
    titleSlide.addText(`Class: ${data.className}`, {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.4,
      fontSize: 14,
      align: 'center',
      color: '888888',
    });
  }
  
  // Learning Objective Slide
  const objectiveSlide = pptx.addSlide();
  objectiveSlide.addText('Learning Objective', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: '1e3a5f',
  });
  
  objectiveSlide.addText(data.learningObjective, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3,
    fontSize: 20,
    color: '333333',
    bullet: false,
    valign: 'top',
  });
  
  // Content slides - one per major section
  const sections = parseMarkdownContent(data.content);
  
  for (const section of sections) {
    if (!section.title && !section.text) continue;
    
    const slide = pptx.addSlide();
    
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: '1e3a5f',
      });
    }
    
    if (section.text) {
      const cleanedText = cleanMarkdown(section.text);
      const lines = cleanedText.split('\n').filter(line => line.trim());
      
      // Group into bullet points
      const bulletPoints = lines.map(line => {
        const isBullet = line.startsWith('• ');
        return {
          text: isBullet ? line.substring(2) : line,
          options: { bullet: isBullet, fontSize: 16, color: '333333' as const }
        };
      });
      
      slide.addText(bulletPoints, {
        x: 0.5,
        y: section.title ? 1.4 : 0.5,
        w: 9,
        h: 4,
        valign: 'top',
      });
    }
  }
  
  // Visual Schedule slides if available
  if (data.visualSteps && data.visualSteps.length > 0) {
    const scheduleSlide = pptx.addSlide();
    scheduleSlide.addText('Visual Schedule', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '1e3a5f',
    });
    
    // Create a grid of visual steps
    const stepsPerRow = 4;
    const stepWidth = 2;
    const stepHeight = 1.5;
    const startX = 0.5;
    const startY = 1.5;
    const gap = 0.25;
    
    data.visualSteps.forEach((step, index) => {
      const row = Math.floor(index / stepsPerRow);
      const col = index % stepsPerRow;
      const x = startX + col * (stepWidth + gap);
      const y = startY + row * (stepHeight + gap);
      
      // Add step number and label
      scheduleSlide.addText(`${index + 1}. ${step.label}`, {
        x,
        y,
        w: stepWidth,
        h: 0.4,
        fontSize: 12,
        bold: true,
        align: 'center',
        color: '1e3a5f',
      });
    });
  }
  
  await pptx.writeFile({ fileName: `${filename}.pptx` });
}

// Export to PDF (using browser print dialog with PDF option)
export function exportToPDF(): void {
  // Set a hint for the user that they should select "Save as PDF"
  // Modern browsers allow saving as PDF from the print dialog
  window.print();
}

// Generate a safe filename
export function generateFilename(data: LessonData): string {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 30);
  const date = new Date().toISOString().split('T')[0];
  return `lesson-${sanitize(data.curriculumArea)}-${sanitize(data.lessonTopic)}-${date}`;
}
