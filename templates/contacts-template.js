async function getContactListTemplate(name, email, bgColorClass) {
return `
    <div>
        <div class="container-contact" onclick="selectContact()" id="selectContact">
            <div class="container-initials ${bgColorClass}" id="doppelInitials-${name}">AM</div>
                <div class="container-contact-preview">
                    <span class="contact-preview-name" id="${name}">${name}</span>
                    <span class="contact-preview-mail">${email}</span>
                </div>
            </div>
        </div>
    </div>
`
}

// async function selectMoreContactInformationTemplate(i){
// return `
//     <section>
//         <div>
//             <div class="more-info-initials">
//                 <h1>AM</h1>
//             </div>
//             <div>
//                 <h1>${allContacts[i].name}</h1>
//             </div>
//         </div>
//     </section>
// `
// }