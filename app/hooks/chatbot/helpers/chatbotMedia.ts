/** Tạo FormData upload media với device/symptom context để backend xử lý đúng phiên. */
export function buildUploadSessionMediaFormData(input: {
  file: File;
  deviceType?: string;
  symptom?: string;
}) {
  const formData = new FormData();

  formData.append("file", input.file);
  formData.append("deviceType", input.deviceType ?? "");
  formData.append("symptom", input.symptom ?? "");

  return formData;
}
