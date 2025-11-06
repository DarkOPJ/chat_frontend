import { toast } from "react-toastify";
import useAuthStore from "../store/AuthStore";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB - adjust to your needs
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_DIMENSION = 4096; // optional: reject images > 4096px in either dimension

// Make sure the file format is good
const checkMagicBytes = async (file) => {
  // read first 8 bytes
  if (!file.slice) return false;
  const header = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(header);

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  let isPng = true;
  for (let i = 0; i < pngSig.length; i++) {
    if (bytes[i] !== pngSig[i]) {
      isPng = false;
      break;
    }
  }
  if (isPng) return "image/png";

  // JPEG signature: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  return false;
};

const handleImage = async (e, setSelectedImage) => {
  const { update_profile_pic } = useAuthStore.getState();

  const file = e.target.files && e.target.files[0];
  if (!file) return;

  // check file size
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File too large. Maximum is 4 MB.");
    e.target.value = null;
    return;
  }
  // MIME check
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error("Unsupported file type. Only PNG and JPG allowed.");
    e.target.value = null;
    return;
  }

  // magic bytes check (stronger)
  let magic = false;
  try {
    magic = await checkMagicBytes(file);
  } catch (err) {
    console.warn("Magic check failed:", err);
  }
  if (!magic || !ALLOWED_TYPES.includes(magic)) {
    toast.error("Unsupported file type. Only PNG and JPG allowed.");
    e.target.value = null;
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = async () => {
    const base64Image = reader.result;

    const img = new Image();
    img.onload = async () => {
      if (
        img.naturalWidth > MAX_DIMENSION ||
        img.naturalHeight > MAX_DIMENSION
      ) {
        toast.error("Image dimensions too large.");
        e.target.value = null;
        return;
      }

      setSelectedImage(base64Image);

      // Upload image
      toast.promise(
        update_profile_pic({ profile_pic: base64Image }),
        {
          pending: {
            render: "Uploading...",
            icon: "⏳",
          },
          success: {
            render({ data }) {
              return data?.message || "Upload complete!";
            },
            icon: "✅",
          },
          error: {
            render({ data }) {
              return (
                data?.response?.data?.message ||
                data?.message || "Upload failed."
              );
            },
            icon: "❌",
          },
        },
        {
          autoClose: 5000,
        }
      );
    };

    img.onerror = () => {
      // setError("Failed to read image dimensions.");
      e.target.value = null;
    };
    img.src = base64Image;
  };

  reader.onerror = () => {
    toast.error("Failed to upload your image.");
    e.target.value = null;
  };
  // clear the file input value so same file can be selected again later
  e.target.value = null;
};

const getAvatarInitials = (nameToUse) => {
  if (!nameToUse || typeof nameToUse !== "string") return "?";

  const trimmed = nameToUse.trim();
  if (trimmed.length === 0) return "?";

  const parts = trimmed.split(/\s+/);

  // helper: return first valid char (skipping apostrophes/dashes)
  const getFirstValidChar = (s) => {
    const chars = [...s];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (/[A-Za-z0-9\u00C0-\uFFFF]/.test(c)) return c; // includes emojis and unicode
    }
    return "";
  };

  // helper: return last valid char (skipping trailing symbols)
  const getLastValidChar = (s) => {
    const chars = [...s];
    for (let i = chars.length - 1; i >= 0; i--) {
      const c = chars[i];
      if (/[A-Za-z0-9\u00C0-\uFFFF]/.test(c)) return c;
    }
    return "";
  };

  if (parts.length === 1) {
    // Single-word name
    const word = parts[0];
    const f = getFirstValidChar(word);
    const l = getLastValidChar(word);
    return (f + l).toUpperCase();
  }

  // Multi-word name
  const f = getFirstValidChar(parts[0]);
  const l = getFirstValidChar(parts[parts.length - 1]);
  return (f + l).toUpperCase();
};

export { handleImage, getAvatarInitials };
