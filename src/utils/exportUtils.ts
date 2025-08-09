export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map((obj) =>
      Object.values(obj)
        .map((value) =>
          typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
        )
        .join(",")
    )
    .join("\n");

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
