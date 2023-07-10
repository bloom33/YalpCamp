function addFileNames(e) {
  const form = document.querySelector("#formFile");
  form.innerHTML = "";
  let images = document.getElementById("image"); //selecting 'image' id from ejs new and edit forms
  let num = images.files.length; //
  for (i = 0; i < num; i++) {
    let urls = URL.createObjectURL(e.target.files[i]); //
    document.getElementById("formFile").innerHTML += `<img src="${urls}">`;
    //
  }
}

// function addFileNames(e) {
//   // select imgPreview div where imgs will be displayed:
//   const imgPreview = document.querySelector("#imgPreview");
//   // clear previous images:
//   imgPreview.innerHTML = "";
//   // loop over files and add to imgPreview div:
//   for (i = 0; i < e.target.files.length; i++) {
//     const urls = URL.createObjectURL(e.target.files[i]);
//     const fileName = e.target.files[i].name;
//     imgPreview.innerHTML += `<figure class="figure mt-2 col-4 col-lg-3">
// <img class="img-thumbnail" src="${urls}"><figcaption class="figure-caption">${fileName}</figcaption></figure>
// `;
//   }
// }

// Listens for a change on file input and if there is a change, calls preview function
document.querySelector("#imgUpload").addEventListener("change", (e) => {
  if (!e.target.files) return; // Do nothing.
  addFileNames(e);
});
