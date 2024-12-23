import os
import pymupdf

def extract_text_from_pdf(pdf_path, output_txt_path):
    # Open the PDF file
    pdf_document = pymupdf.open(pdf_path)

    # Initialize an empty string to hold the extracted text
    extracted_text = ""

    # Iterate through each page in the PDF
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)  # Load the page
        text = page.get_textpage().extractText()  # Extract text from the page
        extracted_text += text + "\n"  # Add the text to the extracted_text string

    # Close the PDF document
    pdf_document.close()

    # Write the extracted text to a text file
    with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
        txt_file.write(extracted_text)

    print(f"Text has been successfully extracted from {pdf_path} and saved to {output_txt_path}")

def process_pdfs_in_folder(input_folder, output_folder):
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Iterate through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(input_folder, filename)
            output_txt_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.txt')
            extract_text_from_pdf(pdf_path, output_txt_path)

# Example usage
input_folder = 'pdf/'
output_folder = 'text/'
process_pdfs_in_folder(input_folder, output_folder)
