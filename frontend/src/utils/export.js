// Convert TipTap JSON to Markdown
export const tiptapToMarkdown = (doc) => {
    if (!doc || !doc.content) return '';

    let markdown = '';

    const processNode = (node, level = 0) => {
        const indent = '  '.repeat(level);

        switch (node.type) {
            case 'heading':
                const headingLevel = node.attrs?.level || 1;
                markdown += '#'.repeat(headingLevel) + ' ';
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '\n\n';
                break;

            case 'paragraph':
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '\n\n';
                break;

            case 'text':
                let text = node.text || '';

                if (node.marks) {
                    node.marks.forEach(mark => {
                        switch (mark.type) {
                            case 'bold':
                                text = `**${text}**`;
                                break;
                            case 'italic':
                                text = `*${text}*`;
                                break;
                            case 'code':
                                text = `\`${text}\``;
                                break;
                            case 'strike':
                                text = `~~${text}~~`;
                                break;
                            case 'link':
                                text = `[${text}](${mark.attrs?.href || ''})`;
                                break;
                        }
                    });
                }

                markdown += text;
                break;

            case 'bulletList':
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '\n';
                break;

            case 'orderedList':
                if (node.content) {
                    node.content.forEach((child, index) => {
                        markdown += `${index + 1}. `;
                        processNode(child, level);
                    });
                }
                markdown += '\n';
                break;

            case 'listItem':
                markdown += indent + '- ';
                if (node.content) {
                    node.content.forEach(child => processNode(child, level + 1));
                }
                break;

            case 'taskList':
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '\n';
                break;

            case 'taskItem':
                const checked = node.attrs?.checked;
                markdown += indent + `- [${checked ? 'x' : ' '}] `;
                if (node.content) {
                    node.content.forEach(child => processNode(child, level + 1));
                }
                break;

            case 'codeBlock':
                const language = node.attrs?.language || '';
                markdown += `\`\`\`${language}\n`;
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '```\n\n';
                break;

            case 'blockquote':
                markdown += '> ';
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
                markdown += '\n\n';
                break;

            case 'horizontalRule':
                markdown += '---\n\n';
                break;

            case 'image':
                const src = node.attrs?.src || '';
                const alt = node.attrs?.alt || '';
                markdown += `![${alt}](${src})\n\n`;
                break;

            case 'hardBreak':
                markdown += '  \n';
                break;

            default:
                if (node.content) {
                    node.content.forEach(child => processNode(child, level));
                }
        }
    };

    if (doc.content) {
        doc.content.forEach(node => processNode(node));
    }

    return markdown.trim();
};

// Download file helper
export const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Export single note as Markdown
export const exportNoteAsMarkdown = (note) => {
    const title = note.title || 'Untitled';
    const content = tiptapToMarkdown(note.content);

    const markdown = `# ${title}\n\n${content}`;
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

    downloadFile(markdown, filename, 'text/markdown');
};

// Export all notes as Markdown (ZIP would require additional library)
export const exportAllNotesAsMarkdown = (notes) => {
    notes.forEach(note => {
        exportNoteAsMarkdown(note);
    });
};

// Export as JSON
export const exportAsJSON = (data, filename = 'bloom_export.json') => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, filename, 'application/json');
};

// Export note as PDF
export const exportNoteAsPDF = async (note, editorElement) => {
    try {
        // Dynamically import libraries to avoid issues
        const jsPDF = (await import('jspdf')).default;
        const html2canvas = (await import('html2canvas')).default;

        const title = note.title || 'Untitled';

        // If we have the editor element, capture it as image
        if (editorElement) {
            // Temporarily force light mode for PDF export
            const htmlElement = document.documentElement;
            const wasDarkMode = htmlElement.classList.contains('dark');

            if (wasDarkMode) {
                htmlElement.classList.remove('dark');
            }

            // Give browser time to re-render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(editorElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                foreignObjectRendering: false,
                imageTimeout: 0
            });

            // Restore dark mode if it was active
            if (wasDarkMode) {
                htmlElement.classList.add('dark');
            }

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit page
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add more pages if content is longer
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        } else {
            // Fallback: Create simple PDF from markdown
            const markdown = tiptapToMarkdown(note.content);
            const pdf = new jsPDF();

            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(0, 0, 0); // Black text
            pdf.text(title, 20, 20);

            // Add content
            pdf.setFontSize(12);
            pdf.setTextColor(50, 50, 50); // Dark grey text
            const lines = pdf.splitTextToSize(markdown, 170);
            pdf.text(lines, 20, 40);

            pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        }
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to export PDF. Please try again.');
    }
};
