/**
 * NORA-MATH Hub - Script Logic
 */

// Membuka situs NoteGPT pada tab baru
function openNoteGPT() {
    window.open('https://notegpt.io/id/youtube-transcript-generator', '_blank');
}

// Mengekstrak poin-poin penting/menarik dari teks transkrip mentah
function extractHighlights() {
    const rawText = document.getElementById('rawTranscript').value.trim();
    const placeholder = document.getElementById('placeholderText');
    const container = document.getElementById('highlightContent');
    const btnCopy = document.getElementById('btnCopy');
    const charCount = document.getElementById('charCount');

    if (!rawText) {
        showToast('Silakan tempelkan teks transkrip terlebih dahulu.', 'error');
        return;
    }

    // Pemrosesan sederhana ekstraksi kalimat kunci / pembersihan paragraf
    const sentences = rawText
        .split(/(?<=[.?!])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);

    if (sentences.length === 0) {
        showToast('Teks terlalu pendek untuk diekstrak.', 'error');
        return;
    }

    // Mengambil beberapa bagian kalimat penting (contoh: maksimal 5 kalimat utama)
    const step = Math.max(1, Math.floor(sentences.length / 5));
    const selectedHighlights = [];
    
    for (let i = 0; i < sentences.length && selectedHighlights.length < 5; i += step) {
        selectedHighlights.push(sentences[i]);
    }

    // Menampilkan hasil
    placeholder.classList.add('hidden');
    container.innerHTML = '';
    container.classList.remove('hidden');

    let formattedOutput = "";

    selectedHighlights.forEach((point, index) => {
        const item = document.createElement('div');
        item.className = 'p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs animate-fade-in flex gap-2';
        item.innerHTML = `<span class="text-indigo-400 font-semibold">•</span> <span>${point}</span>`;
        container.appendChild(item);

        formattedOutput += `• ${point}\n`;
    });

    // Simpan string terformat di data atribut untuk kemudahan salin
    container.setAttribute('data-formatted', formattedOutput.trim());

    // Update status UI
    charCount.textContent = `${formattedOutput.length} karakter`;
    btnCopy.disabled = false;
    btnCopy.classList.remove('bg-emerald-600/50');
    btnCopy.classList.add('bg-emerald-600');

    showToast('Highlight berhasil diekstrak!');
}

// Menyalin hasil highlight ke clipboard pengguna
function copyHighlights() {
    const container = document.getElementById('highlightContent');
    const textToCopy = container.getAttribute('data-formatted');

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Highlight disalin! Tempelkan (Ctrl+V) ke Chatbot.');
    }).catch(err => {
        showToast('Gagal menyalin teks.', 'error');
        console.error('Copy Error:', err);
    });
}

// Menghapus/Reset Form
function clearAll() {
    document.getElementById('rawTranscript').value = '';
    const placeholder = document.getElementById('placeholderText');
    const container = document.getElementById('highlightContent');
    const btnCopy = document.getElementById('btnCopy');
    const charCount = document.getElementById('charCount');

    placeholder.classList.remove('hidden');
    container.classList.add('hidden');
    container.innerHTML = '';
    container.removeAttribute('data-formatted');
    
    charCount.textContent = '0 karakter';
    btnCopy.disabled = true;
    btnCopy.classList.add('bg-emerald-600/50');
    btnCopy.classList.remove('bg-emerald-600');
}

// Notifikasi Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;

    if (type === 'error') {
        toast.classList.remove('bg-emerald-600');
        toast.classList.add('bg-rose-600');
    } else {
        toast.classList.remove('bg-rose-600');
        toast.classList.add('bg-emerald-600');
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}