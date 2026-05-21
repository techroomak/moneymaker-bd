const url =
new URL(window.location.href);

const key =
url.searchParams.get("key");

if(key !== "AKADMIN2026"){

document.body.innerHTML =
"Access Denied";

throw new Error(
"Unauthorized"
);

}
