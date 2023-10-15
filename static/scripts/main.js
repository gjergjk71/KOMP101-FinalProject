window.onload = e => {
    window.add_project_modal_shown = false;

    const create_error_div = (text = "Invalid email or password", className) => {
        const div = document.createElement("div");
        div.className = className || "error_div";
        const innerDiv = document.createElement("div")
        innerDiv.innerText = text;
        div.appendChild(innerDiv);
        return div;        
    }
    const on_project_delete_button = (e, el) => {
        e.preventDefault();

        const items = document.querySelectorAll("table tr");
        if ((items.length - 1) <= 1) {
            document.querySelector("#error").innerHTML = "List is empty";
        }
        el.parentElement.parentElement.outerHTML = "";

        localStorage.setItem("projects__table", document.querySelector("table").outerHTML);

    }
    const project__id_link = (e, el) => {
        el.onclick = e => {
            e.preventDefault();

            window.location.pathname = "/src/projects__" + parseInt(
                el.parentElement.id.split("__")[1]
            )
        }
    }
    let main__form = document.querySelector("#main__form")
    !main__form ? null : main__form.onsubmit = e => {
        e.preventDefault();
    
        document.querySelector("#form__errors").innerHTML = "";
        
        const { validCredentials } = window;
        
        const email = document.getElementById("main__email").value;
        const password = document.getElementById("main__password").value;
        
        const validEmail = validCredentials.email === email;
        const validPassword = validCredentials.password === password;
        
        const valid = validEmail && validPassword

        if (!valid) {
            document.querySelector("#form__errors").appendChild(
                create_error_div("Invalid email or password")
            );
        } else {
            window.location.pathname = "/src/projects"
        }
    }

    document.querySelectorAll(".project__delete__button").forEach(el => {
        console.log(el)
        el.onclick = e => on_project_delete_button(e, el)
    });

    document.querySelectorAll(".project__id_link").forEach(el => {
        console.log(el)
        el.onclick = e => project__id_link(e, el)
    });

    !document.querySelector("#add_project") ? null : document.querySelector("#add_project").onclick = e => {
        e.preventDefault();

        const form = document.createElement("div");
        form.innerHTML = `
            <form id="projects__form">
                <div style="margin-bottom: 30px;" id="form__errors">

                </div>
                <div class="form__labelinput">
                    <div class="form__label"><span>Name:</span></div>
                    <input id="projects__name" class="form__input" placeholder="Name" />
                </div>
                <div class="form__labelinput">
                    <div class="form__label"><span>Web:</span></div>
                    <select id="projects__web" class="form__input" id="main__web">
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                    </select>

                </div>
                    <button id="form__create_buton">
                        <div>Create</div>
                    </button>
            </form>

        `
        form.querySelector("#form__create_buton").onclick = e => {
            form.querySelector("#form__errors").innerHTML = "";
            const name = form.querySelector("#projects__name").value;
            const web = form.querySelector("#projects__web").value;
            if (!name.length) {
                form.querySelector("#form__errors").innerHTML = create_error_div("Name must not be empty").outerHTML;
            }
            const last_id = document.querySelector("table tr:last-child").id.split("__")[1];
            const new_id = isNaN(parseInt(last_id) + 1) ? 1 : parseInt(last_id) + 1;

            const tr = document.createElement("tr")
            tr.id = "project__" + new_id;
            tr.innerHTML = `
                <td class="project__id_link" style="cursor: pointer">#${new_id}</td>
                <td>${name}</td>
                <td>${web}</td>
                <td><button class="project__delete__button">Delete</button></td>
            `
            tr.querySelector(".project__delete__button").onclick = e => on_project_delete_button(e, tr.querySelector(".project__delete__button"));
            tr.querySelector(".project__id_link").onclick = e => project__id_link(
                e, tr.querySelector(".project__id_link")
            )
            document.querySelector("table > tbody ").appendChild(tr);
            document.querySelector(".modal__overlay").outerHTML = "";

            localStorage.setItem("projects__table", document.querySelector("table").outerHTML);

        }
        const add_project = document.createElement("h1");
        add_project.innerHTML = "Add Project"

        const container = document.createElement("div");
        container.className = "modal__container";
        container.appendChild(add_project);
        container.appendChild(form);

        const overlay = document.createElement("div");
        
        overlay.id = "modal";
        overlay.onclick = e => {
            // overlay.outerHTML = "";
            // const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = overlay;
            
            // const horizontally = offsetWidth <= e.offsetX && e.offsetX >= offsetWidth + offsetLeft;
            // const vertically = offsetHeight <= e.offsetY && e.offsetY >= offsetHeight + offsetTop;

            // console.log({ offsetWidth, offsetX: e.offsetX, offsetWidth, offsetLeft})
            // console.log(e);
            const clicked_container = e.target.className != "modal__overlay";
            if (clicked_container) {
                e.preventDefault();
            } else {
                overlay.outerHTML = "";
            }
            
        }
        
        overlay.className = "modal__overlay";
        overlay.appendChild(container)
        document.body.appendChild(overlay);
    }

    document.querySelectorAll("#form__edit__button").forEach(el => {
        el.onclick = e => {
            e.preventDefault();
            const name = document.querySelector("#projects__name").value
            const platform = document.querySelector("#projects__web").value;
    
            const project_id = window.location.pathname.split("__")[1]
            const el_id = "project__" + project_id
            const body = document.createElement("body");
            body.innerHTML = localStorage.getItem("projects__table");
            const tr = body.querySelector("#" + el_id)
            tr.querySelector("td:nth-child(2)")

            tr.querySelector("td:nth-child(2)").innerHTML = name.replace("Name: ", "");
            tr.querySelector("td:nth-child(3)").innerHTML = platform.replace("Platform: ", "");

            localStorage.setItem("projects__table", body.querySelector("table").outerHTML);
            window.location.hash = "success"
            window.location.pathname = window.location.pathname.replace("__edit", "")
        }
    })
    const bool = (
        window.location.pathname == "/src/projects__1" ||
        window.location.pathname == "/src/projects__2" ||
        window.location.pathname == "/src/projects__3" ||
        window.location.pathname == "/src/projects__4" || 
        window.location.pathname == "/src/projects__5"
    )
    if (window.location.hash == "#success" && bool) {
        document.getElementById("single_project_section").innerHTML =
        create_error_div("Updated successfully", "success_div").outerHTML + document.getElementById("single_project_section").innerHTML
    }
    if (bool) {
        const id = window.location.pathname.split("__")[1]
        document.getElementById("projects").innerHTML += "<button><a href=\"/src/projects__" + id + "__edit\">Edit</a></button>";
    }
}