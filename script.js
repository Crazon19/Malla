document.addEventListener('DOMContentLoaded', () => {
    // Definición de los ramos por semestre y sus requisitos
    // La clave del objeto es el nombre del semestre, y el valor es un array de objetos ramo.
    // Cada ramo tiene un 'name' y un array 'prerequisites'.
    // 'ADMISSION' es un requisito especial que se considera cumplido por defecto.
    const curriculum = {
        "Primer semestre": [
            { name: "Fundamentos de enfermería", prerequisites: ["ADMISSION"] },
            { name: "Quimica general y organica", prerequisites: ["ADMISSION"] },
            { name: "Anatomia humana", prerequisites: ["ADMISSION"] },
            { name: "biologia celular y genetica", prerequisites: ["ADMISSION"] },
            { name: "Psicologica", prerequisites: ["ADMISSION"] },
            { name: "Transversal", prerequisites: ["ADMISSION"] },
            { name: "Matematica", prerequisites: ["ADMISSION"] }
        ],
        "Segundo semestre": [
            { name: "Cuidados basicos de enfermeria", prerequisites: ["Fundamentos de enfermería"] },
            { name: "Bioquimica", prerequisites: ["Quimica general y organica"] },
            { name: "Embriologia e histologia", prerequisites: ["ADMISSION"] },
            { name: "Microbiologia y parasitologia", prerequisites: ["ADMISSION"] },
            { name: "coreano", prerequisites: ["ADMISSION"] },
            { name: "Socio antropología", prerequisites: ["ADMISSION"] },
            { name: "Psicologia Comunitaria", prerequisites: ["Psicologica"] }
        ],
        "Tercer Semestre": [
            { name: "procesos y cuidados de enfermería I", prerequisites: ["Cuidados basicos de enfermeria"] },
            { name: "salud publica", prerequisites: ["ADMISSION"] },
            { name: "farmacología", prerequisites: ["Bioquimica"] },
            { name: "fisiología", prerequisites: ["Embriologia e histologia"] },
            { name: "Bioestadística", prerequisites: ["Matematica"] },
            { name: "ingles I", prerequisites: ["ADMISSION"] },
            { name: "electivo", prerequisites: ["ADMISSION"] } // Asumiendo que los electivos no tienen requisitos específicos más allá de la admisión
        ],
        "Cuarto semestre": [
            { name: "procesos y cuidados de enfermería 2", prerequisites: ["procesos y cuidados de enfermería I"] },
            { name: "farmacologia aplicada en la enfermeria", prerequisites: ["farmacología"] },
            { name: "Enfermeria en salud familiar y Comunitaria I", prerequisites: ["Socio antropología"] },
            { name: "fisiopatología", prerequisites: ["fisiología"] },
            { name: "Gestion y administracion en salud", prerequisites: ["salud publica"] },
            { name: "Ingles 2", prerequisites: ["ingles I"] },
            { name: "curso institucional", prerequisites: ["ADMISSION"] }
        ],
        "Quinto Semestre": [
            { name: "Enfermeria en Salud de la Mujer", prerequisites: ["procesos y cuidados de enfermería 2"] },
            { name: "Enfermería en Salud familiar y Comunitaria II", prerequisites: ["Enfermeria en salud familiar y Comunitaria I"] },
            { name: "Enfermeria en medico Quirurgico", prerequisites: ["farmacologia aplicada en la enfermeria"] },
            { name: "Enfermeria en gerontologia y geriatria", prerequisites: ["ADMISSION"] },
            { name: "Gestion y administracion en servicio de enfermeria I", prerequisites: ["Gestion y administracion en salud"] },
            { name: "Interdisciplinar A+S", prerequisites: ["ADMISSION"] }
        ],
        "Sexto Semestre": [
            { name: "Gestion y administracion en servicios de enfermeria 2", prerequisites: ["Gestion y administracion en servicio de enfermeria I"] },
            { name: "Enfermería en Salud familiar y Comunitaria II (Sexto)", prerequisites: ["ADMISSION"] }, // Duplicado de nombre, aclarado para diferenciar
            { name: "Enfermeria en medico Quirurgico (Sexto)", prerequisites: ["ADMISSION"] }, // Duplicado de nombre, aclarado para diferenciar
            { name: "Enfermeria en gerontologia y geriatria (Sexto)", prerequisites: ["ADMISSION"] }, // Duplicado de nombre, aclarado para diferenciar
            { name: "Metodologia de la investigacion", prerequisites: ["ADMISSION"] },
            { name: "interdisciplinar", prerequisites: ["ADMISSION"] }
        ],
        "septimo semestre": [
            { name: "Enfermeria en pediatria", prerequisites: ["ADMISSION"] },
            { name: "Gestion y administracion en servicios de enfermeria 3", prerequisites: ["Gestion y administracion en servicios de enfermeria 2"] },
            { name: "Enfermeria en urgencia", prerequisites: ["ADMISSION"] },
            { name: "Enfermeria en Salud Mental 1", prerequisites: ["ADMISSION"] },
            { name: "investigacion en enfermeria I", prerequisites: ["ADMISSION"] },
            { name: "Electivo disciplinar", prerequisites: ["ADMISSION"] }
        ],
        "octavo Semestre": [
            { name: "Enfermeria en pediatria (Octavo)", prerequisites: ["ADMISSION"] }, // Duplicado de nombre, aclarado
            { name: "Gestion y administracion en servicios de enfermeria 3 (Octavo)", prerequisites: ["Gestion y administracion en servicios de enfermeria 2"] }, // Duplicado de nombre, aclarado
            { name: "Enfermeria en urgencia (Octavo)", prerequisites: ["ADMISSION"] }, // Duplicado de nombre, aclarado
            { name: "Enfermeria en Salud Mental 2", prerequisites: ["Enfermeria en Salud Mental 1"] },
            { name: "investigacion en enfermeria 2", prerequisites: ["investigacion en enfermeria I"] },
            { name: "Electivo disciplinar 2", prerequisites: ["Electivo disciplinar"] }
        ],
        "Noveno semestre": [
            { name: "internado enfermeria I (Noveno)", prerequisites: ["octavo semestre aprobado"] }, // Requisito especial para semestre completo
            { name: "internado enfermeria 2 (Noveno)", prerequisites: ["octavo semestre aprobado"] }
        ],
        "10 semestre": [
            { name: "internado enfermeria I (10)", prerequisites: ["octavo semestre aprobado"] }, // Requisito especial para semestre completo
            { name: "internado enfermeria 2 (10)", prerequisites: ["octavo semestre aprobado"] }
        ]
    };

    // Almacenamiento de los ramos aprobados en el navegador
    let approvedCourses = JSON.parse(localStorage.getItem('approvedCourses')) || [];

    // Referencias a elementos del DOM
    const curriculumGrid = document.getElementById('curriculum-grid');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');

    /**
     * Renderiza la malla curricular en el DOM.
     * Itera a través de los semestres y crea las columnas y ramos.
     */
    function renderCurriculum() {
        curriculumGrid.innerHTML = ''; // Limpiar el contenido previo
        for (const semesterName in curriculum) {
            const semesterColumn = document.createElement('div');
            semesterColumn.classList.add('semester-column');

            const semesterTitle = document.createElement('h2');
            semesterTitle.textContent = semesterName;
            semesterColumn.appendChild(semesterTitle);

            const courseList = document.createElement('ul');
            courseList.classList.add('course-list');

            curriculum[semesterName].forEach(course => {
                const courseItem = document.createElement('li');
                courseItem.classList.add('course-item');
                courseItem.dataset.name = course.name; // Almacena el nombre del ramo en un atributo de datos
                courseItem.textContent = course.name;

                // Añadir clase 'approved' si el ramo ya está aprobado
                if (approvedCourses.includes(course.name)) {
                    courseItem.classList.add('approved');
                }

                courseItem.addEventListener('click', () => toggleCourseApproval(course.name, semesterName));
                courseList.appendChild(courseItem);
            });

            semesterColumn.appendChild(courseList);
            curriculumGrid.appendChild(semesterColumn);
        }
        updateCourseStates(); // Actualiza el estado inicial de bloqueados después de renderizar
    }

    /**
     * Comprueba si un ramo específico tiene todos sus requisitos cumplidos.
     * @param {string} courseName - El nombre del ramo a verificar.
     * @returns {object} Un objeto con 'isFulfilled' (boolean) y 'missingPrerequisites' (array de strings).
     */
    function checkPrerequisites(courseName) {
        let isFulfilled = true;
        const missingPrerequisites = [];
        let allCourses = []; // Para buscar todos los ramos en la malla

        // Recopilar todos los ramos para facilitar la búsqueda
        for (const semester in curriculum) {
            allCourses = allCourses.concat(curriculum[semester]);
        }

        const course = allCourses.find(c => c.name === courseName);

        if (!course) {
            console.warn(`Ramo "${courseName}" no encontrado en la malla.`);
            return { isFulfilled: true, missingPrerequisites: [] }; // Si no se encuentra, asumir que no tiene requisitos o son cumplidos
        }

        if (course.prerequisites && course.prerequisites.length > 0) {
            for (const req of course.prerequisites) {
                // Manejar el requisito especial 'octavo semestre aprobado'
                if (req === "octavo semestre aprobado") {
                    const allEighthSemesterCourses = curriculum["octavo Semestre"].map(c => c.name);
                    const allEighthSemesterApproved = allEighthSemesterCourses.every(c => approvedCourses.includes(c));
                    if (!allEighthSemesterApproved) {
                        isFulfilled = false;
                        missingPrerequisites.push("Todos los ramos de Octavo Semestre");
                    }
                } else if (req !== "ADMISSION" && !approvedCourses.includes(req)) {
                    isFulfilled = false;
                    missingPrerequisites.push(req);
                }
            }
        }
        return { isFulfilled, missingPrerequisites };
    }

    /**
     * Alterna el estado de aprobación de un ramo.
     * @param {string} courseName - El nombre del ramo a marcar/desmarcar.
     * @param {string} semesterName - El nombre del semestre al que pertenece el ramo (para futuros usos).
     */
    function toggleCourseApproval(courseName, semesterName) {
        const courseElement = document.querySelector(`.course-item[data-name="${courseName}"]`);

        if (approvedCourses.includes(courseName)) {
            // Si el ramo ya está aprobado, desaprobarlo
            // Verificar si otros ramos dependen de este antes de desaprobar
            let canDisapprove = true;
            const dependentCourses = [];

            for (const semester in curriculum) {
                curriculum[semester].forEach(course => {
                    if (course.prerequisites.includes(courseName) && approvedCourses.includes(course.name)) {
                        canDisapprove = false;
                        dependentCourses.push(course.name);
                    }
                });
            }

            if (canDisapprove) {
                approvedCourses = approvedCourses.filter(name => name !== courseName);
                saveApprovedCourses();
                updateCourseStates();
            } else {
                showModal(`No puedes desaprobar "${courseName}" porque los siguientes ramos dependen de él: ${dependentCourses.join(', ')}.`);
            }

        } else {
            // Si el ramo no está aprobado, intentar aprobarlo
            const { isFulfilled, missingPrerequisites } = checkPrerequisites(courseName);

            if (isFulfilled) {
                approvedCourses.push(courseName);
                saveApprovedCourses();
                updateCourseStates();
            } else {
                // Mostrar mensaje de ramos bloqueados
                modalMessage.textContent = `Para aprobar "${courseName}" necesitas completar: ${missingPrerequisites.join(', ')}.`;
                modal.style.display = 'flex'; // Mostrar el modal
            }
        }
    }

    /**
     * Guarda la lista de ramos aprobados en el Local Storage del navegador.
     */
    function saveApprovedCourses() {
        localStorage.setItem('approvedCourses', JSON.stringify(approvedCourses));
    }

    /**
     * Actualiza el estado visual de todos los ramos (aprobado/bloqueado) en el DOM.
     */
    function updateCourseStates() {
        document.querySelectorAll('.course-item').forEach(courseItem => {
            const courseName = courseItem.dataset.name;

            // Primero, remover todas las clases de estado para aplicar el correcto
            courseItem.classList.remove('approved', 'blocked');

            if (approvedCourses.includes(courseName)) {
                courseItem.classList.add('approved');
            } else {
                const { isFulfilled } = checkPrerequisites(courseName);
                if (!isFulfilled) {
                    courseItem.classList.add('blocked');
                }
            }
        });
    }

    /**
     * Muestra el modal con un mensaje específico.
     * @param {string} message - El mensaje a mostrar en el modal.
     */
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    }

    // Event listener para cerrar el modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si el usuario hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inicializar la malla curricular al cargar la página
    renderCurriculum();
});
