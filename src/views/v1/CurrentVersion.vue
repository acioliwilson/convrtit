<template>
<div id="app">
    <input type="file" @change="handleFileUpload" />
    <select v-model="imageType">
        <option value="png">PNG</option>
        <option value="webp">WEBP</option>
        <option value="svg">SVG</option>
    </select>
    <button @click="convertImage">Converter</button>
    <div v-if="outputImage">
        <img :src="outputImage" alt="Imagem convertida" />
        <a :href="outputImage" download="converted-image">Download</a>
    </div>
</div>
</template>

    
<script>
import {
    saveAs
} from 'file-saver';

export default {
    data() {
        return {
            inputImage: null,
            outputImage: null,
            imageType: 'png', // pode ser 'png', 'webp', 'svg'
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.inputImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.outputImage = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        async convertImage() {
            if (this.inputImage) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = URL.createObjectURL(this.inputImage);
                img.onload = async () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    if (this.imageType === 'png' || this.imageType === 'webp') {
                        canvas.toBlob((blob) => {
                            this.outputImage = URL.createObjectURL(blob);
                            saveAs(blob, `converted-image.${this.imageType}`);
                        }, `image/${this.imageType}`);
                    } else if (this.imageType === 'svg') {
                        const svgString = this.convertCanvasToSVG(canvas);
                        const svgBlob = new Blob([svgString], {
                            type: 'image/svg+xml;charset=utf-8'
                        });
                        this.outputImage = URL.createObjectURL(svgBlob);
                        saveAs(svgBlob, 'converted-image.svg');
                    }
                };
            }
        },
        convertCanvasToSVG(canvas) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            const img = document.createElementNS(svgNS, "image");
            img.setAttributeNS("http://www.w3.org/1999/xlink", "href", canvas.toDataURL());
            img.setAttribute("width", canvas.width);
            img.setAttribute("height", canvas.height);
            svg.appendChild(img);
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);
            return svgString;
        }
    },
};
</script>
