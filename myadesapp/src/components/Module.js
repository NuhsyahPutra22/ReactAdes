import React, { Fragment, useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/module.css"
import axios from 'axios';

function Module() {
    //Hosting
    const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === `127.0.0.1`;
    const STORAGE_API_HOST = isLocalhost
        ? "http://localhost:3000"
        : "https://adesschoolmanagementsystemca2.herokuapp.com";



    const [Modulecode, setModulecode] = useState("");
    const [ModuleName, setModuleName] = useState("");
    const [ModuleDetail, setModuleDetail] = useState("");
    const [Courseid, setCourseid] = useState("");
    const [SemesterName, setSemesterName] = useState("");

    console.log(Modulecode);
    console.log(ModuleName);
    console.log(ModuleDetail);
    console.log(Courseid);
    console.log(SemesterName);

    useEffect(() => {
        GetCoursename();
        showModule();
    }, []);

    function GetCoursename() {
        let Dropdown = "";
        Dropdown +=
            "<option value={'defaultin'} >" + "Choose a Courseid" + "</option>";
        axios.get(`${STORAGE_API_HOST}/GetCourseName`)
            .then((response) => response.data)
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    let coursename = data[i].coursename
                    console.log(data[i].courseid);
                    console.log(coursename);
                    Dropdown += `<option value="${data[i].coursename}">` + coursename + "</option>"
                    document.getElementById("Acourseid").innerHTML = Dropdown
                }
            })
    }


    function AddModule() {
        console.log(Courseid)
        console.log("working")
        axios.get(`${STORAGE_API_HOST}/GetCourseid/${Courseid}`)
            .then((response) => response.data)
            .then((data) => {
                console.log(data)
                let courseid = data[0].courseid;
               axios.post(`${STORAGE_API_HOST}/Module`, {modulecode : Modulecode, modulename : ModuleName, moduledetail : ModuleDetail, courseid : courseid, semestername : SemesterName}, { headers: { "Content-Type": "application/json" } })
                    .then((response) => {
                        alert("successfully Added Module")
                        window.location.reload()
                        showModule();
                    }
                    )
                
            })
    
    }


    function ClearModulefromtable() {
        const tableBody = document.getElementById("modulelist");
        tableBody.innerHTML = '';
    }



    function showModule() {
        axios.get(`${STORAGE_API_HOST}/Module`)
            .then((response) => response.data)

            .then((data) => {
                var tbody = `<table>`
                for (let i = 0; i < data.result.length; i++) {
                    console.log(data.result[0].modulecode)
                    tbody += `<tbody>`

                    tbody += `  <th scope="col" class="col-2" >${data.result[i].modulecode}</th>`
                    tbody += `<th scope="col" class="col-7" >${data.result[i].modulename}</th>`
                    tbody += `<th scope="col" class="col-3" >${data.result[i].moduledetail}</th>`
                    tbody += `<th scope="col" class="col-3" >${data.result[i].courseid}</th>`
                    tbody += `<th scope="col" class="col-3" >${data.result[i].semestername}</th>`
                    tbody += `<th scope="col" class="col-3" > <button onClick={Updatemodulebtn(${data.result[i].moduleid})}>EDIT</button></th>`
                    tbody += `<th scope="col" class="col-3" > <button onClick={DeleteModuleInfo(${data.result[i].moduleid})}>DELETE</button></th>`
                }
                tbody += `</table>`


                document.getElementById("modulelist").innerHTML = tbody


            })
            .catch((error) => alert(error.message));

    }


    function Updatemodulebtn(moduleid) {
        sessionStorage.getItem("moduleid", moduleid)


        axios.get(`${STORAGE_API_HOST}/Module/${moduleid}`)
            .then((response) => response.data)

            .then((data) => {

                for (let i = 0; i < data.result.length; i++) {
                    var mc = data.result[i].modulecode;
                    console.log(mc)
                    var mn = data.result[i].modulename;
                    var md = data.result[i].moduledetail;
                    var mid = data.result[i].moduleid;


                }

                document.getElementById("Updatemodule-code").value = mc;
                document.getElementById("Updatemodule-name").value = mn;
                document.getElementById("Updatemodule-details").value = md;
                document.getElementById("moduleid").value = mid;

            })
            .catch((error) => alert(error.message));

    }





    function updateModulebtn() {

        const mc = document.getElementById("Updatemodule-code").value;
        const mn = document.getElementById("Updatemodule-name").value;
        const md = document.getElementById("Updatemodule-details").value;
        const mid = document.getElementById("moduleid").value;

        const data = {
            modulecode: mc,
            modulename: mn,
            moduledetail: md
        }
        axios.put(`${STORAGE_API_HOST}/Module/${mid}`)
            .then((response) => response.data)

    }

    //DeleteModuleInfo
    function DeleteModuleInfo(moduleid) {
        console.log(moduleid);
        axios
            .delete(`${STORAGE_API_HOST}/Module/${moduleid}`)
            .then((response) => {
                if (response.status === 200) {
                    // Ok
                    //   .then((data) =>console.log(data)) 
                    console.log("Successfully delete the Moduleinfo");
                    alert("Successfully delete the Moduleinfo", "success", 1500);
                    window.location.reload();
                    showModule();
                    // });
                }
            })

    }



    function loginlogout() {
        var b = sessionStorage.getItem("userid")
        var token = sessionStorage.getItem("token")

        var admin = sessionStorage.getItem("userrole")

        if (admin !== "Admin" || token === null || isNaN(b)) {

            alert("Your role is not Admin")
            window.location.href = "Login.html"
        } else {
            // show log out link

            const html = `
                <li class="nav-item" >
                <a class="nav-link" href="Login.html">Log Out</a>
              </li>
                `
            document.getElementById("loginlogout").innerHTML = html
            document.getElementById("loginlogout").click(function () {
                window.sessionStorage.clear();
                window.location.href = "../view/Login.html"
                window.alert("Successfully Log Out");
            })

        }


    }



    return (
        <Fragment>
            <>
                {/* Content Header */}
                <div className="content-Header">
                    <h1>SOC Management System</h1>
                    <p>With SP, it's So Possible!</p>
                </div>
                {/* Navigation Bar */}
                <nav className="navbar navbar-expand-sm" id="navbar">
                    <div className="container-fluid">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" href="AdminIndex.html">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="AdminModule.html">
                                    Modules
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="AdminCourse.html">
                                    Courses
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="AdminGpa-calculator.html">
                                    Target Setting
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="AdminFeedback.html">
                                    Feedback From Students
                                </a>
                            </li>
                            <li className="nav-item" id="loginlogout">
                                <a className="nav-link" href="Login.html">
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* Page Content */}
                <div id="page-content" className="col-10 py-3">
                    <h3>Modules</h3>
                    <p>Create Module:</p>
                    <div className="form-group row justify-content-md-center mt-4 pb-3 pe-3">
                        {/* Create module form */}
                        <div className="create-module-form row">
                            <div className="form-group">
                                <label htmlFor="module-code">Module Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Amodule-code"
                                    aria-describedby="module-code"
                                    placeholder="Module Code"
                                    onChange={(event) => setModulecode(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="module-name">Module Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Amodule-name"
                                    aria-describedby="module-name"
                                    placeholder="Module Name"
                                    onChange={(event) => setModuleName(event.target.value)}

                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="module-details">Module Details:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Amodule-details"
                                    placeholder="Module Details"
                                    onChange={(event) => setModuleDetail(event.target.value)}

                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="courseid">Courseid:</label>
                                <select className="form-control" id="Acourseid"
                                    defaultValue={"defaultin"}
                                    onChange={(event) => setCourseid(event.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="semestername">SemesterName:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Asemestername"
                                    placeholder="semestername"
                                    onChange={(event) => setSemesterName(event.target.value)}

                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn float-right create-module-button btn-success"
                                data-bs-target="#create-module"
                                id="insert-btn"
                                onClick={() => AddModule(Modulecode, ModuleName, ModuleDetail, Courseid, SemesterName)}
                            >
                                + Create Module
                            </button>
                        </div>
                    </div>
                    <p>Update Module:</p>
                    <div className="form-group row justify-content-md-center mt-4 pb-3 pe-3">
                        {/* Update course form */}
                        <div className="update-module-form row">
                            <div className="form-group">
                                <label htmlFor="module-code">Module Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Updatemodule-code"
                                    aria-describedby="module-code"
                                    placeholder="Module Code"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="module-name">Module Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Updatemodule-name"
                                    aria-describedby="module-name"
                                    placeholder="Module Name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="module-details">Module Details:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Updatemodule-details"
                                    placeholder="Module Details"
                                />
                            </div>
                        </div>
                        <div style={{ visibility: "hidden" }}>
                            <input type="text" id="moduleid" />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn float-end create-module-button btn-info"
                                data-bs-target="#update-module"
                                id="edit-btn"
                                onClick={() => updateModulebtn(Modulecode, ModuleName, ModuleDetail, Courseid, SemesterName)}

                            >
                                + UpdateModuleinfo
                            </button>
                        </div>
                    </div>
                    {/* Module Table */}
                    <div id="content-item-module">
                        <table id="module-table" className="table">
                            <thead>
                                <tr className="align-middle">
                                    <th scope="col" className="col-1">
                                        Module Code
                                    </th>
                                    <th scope="col" className="col-2">
                                        Module Name
                                    </th>
                                    <th scope="col" className="col-3">
                                        Module Details
                                    </th>
                                    <th scope="col" className="col-4">
                                        Course Name
                                    </th>
                                    <th scope="col" className="col-5">
                                        SemesterName
                                    </th>
                                    <th scope="col" className="col-5">
                                        EDIT
                                    </th>
                                    <th scope="col" className="col-5">
                                        DELETE
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="module-content" id="modulelist"></tbody>
                        </table>
                    </div>
                    {/* Footer */}
                    <div className="footer">
                        <h3>Singapore Polytechnic</h3>
                        <p>500 Dover Road Singapore 139651</p>
                    </div>
                    \
                </div>
            </>

        </Fragment>
    )

}

export default Module;
