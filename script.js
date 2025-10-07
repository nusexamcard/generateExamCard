class ExamCardSystem {
    constructor() {
        this.form = document.getElementById('examForm');
        this.previewBtn = document.getElementById('previewBtn');
        this.printBtn = document.getElementById('printBtn');
        this.previewSection = document.getElementById('previewSection');
        this.examCardPreview = document.getElementById('examCardPreview');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.previewBtn.addEventListener('click', () => this.generatePreview());
        this.printBtn.addEventListener('click', () => this.printCard());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    generatePreview() {
        if (!this.validateForm()) {
            alert('Please fill in all required fields and accept the examination rules.');
            return;
        }

        const formData = this.getFormData();
        this.renderPreview(formData);
        this.previewSection.style.display = 'block';
        this.printBtn.style.display = 'inline-block';
        
        // Scroll to preview
        this.previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    getFormData() {
        const formData = {
            admissionNo: document.getElementById('admissionNo').value,
            fullName: document.getElementById('fullName').value,
            programme: document.getElementById('programme').value,
            level: document.getElementById('level').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            digitalSignature: document.getElementById('digitalSignature').value,
            timestamp: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        };

        // Get selected courses
        const courseCheckboxes = document.querySelectorAll('input[name="courses"]:checked');
        formData.courses = Array.from(courseCheckboxes).map(cb => {
            return {
                code: cb.value,
                name: cb.nextElementSibling.textContent.split(' - ')[1].split(' (')[0],
                units: cb.nextElementSibling.textContent.match(/\((\d+) Units?\)/)[1]
            };
        });

        return formData;
    }

    renderPreview(data) {
        const coursesHtml = data.courses.map((course, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.units}</td>
                <td></td>
            </tr>
        `).join('');

        this.examCardPreview.innerHTML = `
            <div class="preview-header">
                <h2>NORTHWEST UNIVERSITY SOKOTO</h2>
                <p class="motto">Knowledge Excellence and Success</p>
                <p class="university-code">(NWUS)</p>
            </div>

            <div class="preview-title">
                <h3>EMERGENCY EXAMINATION CARD</h3>
                <p>FIRST SEMESTER 2024/2025 Academic Session</p>
                <p class="timestamp">Generated on: ${data.timestamp}</p>
            </div>

            <div class="preview-student-info">
                <table>
                    <tr>
                        <td><strong>Admission No:</strong> ${data.admissionNo}</td>
                        <td><strong>Name:</strong> ${data.fullName}</td>
                    </tr>
                    <tr>
                        <td><strong>Programme:</strong> ${data.programme}</td>
                        <td><strong>Level:</strong> ${data.level}</td>
                    </tr>
                    <tr>
                        <td><strong>Phone:</strong> ${data.phone}</td>
                        <td><strong>Email:</strong> ${data.email}</td>
                    </tr>
                </table>
            </div>

            <div class="preview-courses">
                <h4>REGISTERED COURSES</h4>
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Unit</th>
                            <th>Invigilator Sign & Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coursesHtml}
                    </tbody>
                </table>
            </div>

            <div class="preview-rules">
                <h4>EXAMINATION RULES ACCEPTANCE</h4>
                <p>I hereby confirm that I have read and agree to abide by all examination rules.</p>
                <div class="signature-line">
                    <p><strong>Digital Signature:</strong> ${data.digitalSignature}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div class="preview-footer">
                <p><em>This is an officially generated emergency examination card.</em></p>
            </div>
        `;
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value) {
                return false;
            }
        }

        const courseCheckboxes = document.querySelectorAll('input[name="courses"]:checked');
        if (courseCheckboxes.length === 0) {
            alert('Please select at least one course.');
            return false;
        }

        return true;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.generatePreview();
    }

    printCard() {
        window.print();
    }

    downloadAsPDF() {
        // This would require additional PDF generation library
        // For now, we'll use the print functionality
        this.printCard();
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExamCardSystem();
});

// Additional utility functions
function saveToLocalStorage(data) {
    const submissions = JSON.parse(localStorage.getItem('examSubmissions') || '[]');
    submissions.push({
        ...data,
        id: Date.now(),
        submittedAt: new Date().toISOString()
    });
    localStorage.setItem('examSubmissions', JSON.stringify(submissions));
}

function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('examSubmissions') || '[]');
}