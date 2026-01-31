from setuptools import setup, find_packages 

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="civic_line_cli",
    version="1.17",  
    author="Hemit Vimal Patel",
    author_email="hemit@nextvoters.com",
    description="Dead simple email sending for developers",
    long_description=long_description,
    long_description_content_type="text/markdown",  
    packages=find_packages(),
    package_data={
        "civic_line_cli": ["helper/prompts/*.txt"]
    },
    install_requires=[
        "openai",
        "psycopg2-binary",
        "requests",
        "beautifulsoup4",  
        "python-docx"
    ],
    entry_points={
        "console_scripts": [
            "civicline = civic_line_cli.main:main"
        ]
    }
)