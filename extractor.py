import os
import json
import fitz  # PyMuPDF

def extract_pdf(pdf_path, output_txt_path, image_output_folder):
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)

    # Initialize an empty string to hold the extracted text
    extracted_text = ""
    title = ""

    # Iterate through each page in the PDF
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)  # Load the page
        text = page.get_text("text")  # Extract text from the page
        extracted_text += text + "\n"  # Add the text to the extracted_text string
        largest_font_size = 0

        # Extract the first page as an image
        if page_num == 0:
            pix = page.get_pixmap() # type: ignore
            image_path = os.path.join(image_output_folder, os.path.splitext(os.path.basename(pdf_path))[0] + '.png')
            pix.save(image_path)
            print(f"First page image has been successfully extracted from {pdf_path} and saved to {image_path}", flush=True)

            text_blocks = page.get_text("dict")["blocks"]

            # Loop through each text block
            for block in text_blocks:
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line["spans"]:
                            font_size = span["size"]
                            if len(span['text']) > 2 and font_size > largest_font_size:
                                largest_font_size = font_size
                                title = span['text'].strip()

    # Close the PDF document
    pdf_document.close()

    # Write the extracted text to a text file
    with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
        txt_file.write(extracted_text)

    print(f"Text has been successfully extracted from {pdf_path} and saved to {output_txt_path}", flush=True)

    return title, pdf_path, output_txt_path, image_path

def process_pdfs_in_folder(input_folder, output_folder, image_output_folder, json_output_path):
    # Ensure the output folders exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    if not os.path.exists(image_output_folder):
        os.makedirs(image_output_folder)

    # List to hold the paths
    data = {
        "files": []
    }

    # Iterate through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(input_folder, filename)
            output_txt_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.txt')
            title, pdf_path, output_txt_path, image_path = extract_pdf(pdf_path, output_txt_path, image_output_folder)
            data["files"].append({
                "title": title,
                "pdf": pdf_path,
                "text": output_txt_path,
                "image": image_path
            })

    # Write the file paths to a JSON file
    with open(json_output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"File paths have been successfully saved to {json_output_path}", flush=True)

# Example usage
input_folder = 'pdf/'
output_folder = 'text/'
image_output_folder = 'images/'
json_output_path = 'data.json'
process_pdfs_in_folder(input_folder, output_folder, image_output_folder, json_output_path)
