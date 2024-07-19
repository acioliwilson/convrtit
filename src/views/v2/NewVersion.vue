<template>
    <header>
        <div class="container">
            <div class="main-header appear">
                <router-link class="brand baloo" to="/">Convrt<span>It</span></router-link>
                <div class="alert appear">
                    <span>A new version upcoming soon!</span>
                    <i class="bi bi-info-circle-fill"></i>
                </div>
            </div>
            <section class="presentation">
                <div class="text">
                    <h1 class="appear">Image Format Converter</h1>
                    <p class="appear">ConvrtIt is an online image format converter. We support a wide range of image formats including JPEG, PNG, GIF, BMP, TIFF, and more. To get started, use the button below and select image files to convert from your computer.</p>
                    <img src="@/assets/v2/arrow.svg" class="arrow">
                </div>
                <div class="animation appear">
                    <div class="png">
                        <div class="circle"></div>
                        <img src="@/assets/v2/png.png" class="png-image">
                        <div class="diamond"></div>
                        <div class="diamond-2"></div>
                        <div class="dot"></div>
                        <div class="dot-2"></div>
                    </div>
                    <img src="@/assets/v2/arrow-to.png" class="arrow-to">
                    <div class="svg">
                        <div class="circle"></div>
                        <img src="@/assets/v2/svg.png" class="svg-image">
                        <div class="diamond"></div>
                        <div class="diamond-2"></div>
                        <div class="dot"></div>
                        <div class="dot-2"></div>
                    </div>
                </div>
            </section>
            <div class="language-selector appear">
                <select>
                    <option value="en">
                        EN
                    </option>
                    <option value="pt">
                        PT
                    </option>
                </select>
                <label class="label">Language</label>
            </div>
        </div>
        <img src="@/assets/v2/shape.svg" class="shape" />
    </header>
    <main>
        <div class="container">
            <div class="tools">
                <input type="file" id="inputFile" @change="handleFileUpload">
                <label for="inputFile" class="upload-btn appear">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <span>SELECT FILE</span>
                </label>
                <span class="convert-label appear">CONVERT TO</span>
                <select class="appear" v-model="imageType">
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                    <option value="svg">SVG</option>
                </select>
                <button class="btn-convert" @click="convertImage">Convert</button>
            </div>
            <div class="preview-container" v-if="outputImage">
                <div class="preview">
                    <span class="appear">Preview</span>
                    <figure class="appear">
                        <img :src="outputImage" alt="Converted Image" />
                    </figure>
                </div>
                <div class="info">
                    <p class="appear">
                        If your download don’t be start automatically, click on the download button bellow.
                    </p>
                    <a :href="outputImage" download="converted-image" class="appear">Download</a>
                </div>
            </div>
        </div>
    </main>
    <section class="container">
        <div class="project-presentation">
            <div class="data-security appear">
                <h2>
                    <i class="bi bi-shield-check"></i>
                    <span>Data Security</span>
                </h2>
                <p>ConvrtIt prioritizes your data security and privacy. Since our inception, we have been trusted by users for our commitment to safeguarding their files. No one except you will ever have access to your files. We earn money by providing premium conversion services, not by selling your data. Read more about this in our Security Overview.</p>
            </div>
            <div class="supported-files appear">
                <h2>
                    <i class="bi bi-file-earmark-image"></i>
                    <span>+200 Formats Supported</span>
                </h2>
                <p>ConvrtIt is your universal app for image format conversions. We support a wide range of image formats including JPEG, PNG, GIF, BMP, TIFF, and many more. Plus, you can use our online tool without downloading any software.</p>
            </div>
        </div>
    </section>
    <footer class="appear">
        <p>Maded with 💙 by <a href="https://github.com/acioliwilson" target="_blank" rel="noopener" class="github"><i class="bi bi-github"></i> acioliwilson</a></p>
    </footer>
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

<style scoped lang="css">
header {
    width: 100%;
    min-height: 300px;
    background: var(--primary-color);
    display: flex;
    flex-direction: column;
    position: relative;
}

.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

a.brand {
    color: #FFF;
    font-weight: 500;
    font-size: 22px;
    letter-spacing: 1px;
}
a.brand span {
    color: var(--light-blue);
}

.alert {
    display: flex;
    gap: 5px;
    align-items: center;
    position: relative;
}

.alert span {
    padding: 8px 40px 8px 25px;
    border-radius: 900px;
    display: table;
    color: #FFF;
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: .8rem;
    background: linear-gradient(-310deg, var(--light-gradient));
    box-shadow: -1px -1px 20px rgba(43, 100, 246, .4);
    animation: 2s shine ease infinite;
}
.alert i {
    color: #FFF;
    font-size: 40px;
    position: absolute;
    z-index: 2;
    right: 0;
    box-shadow: -1px -1px 10px rgba(0, 0, 0, .1);
}

img.shape {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.presentation {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 50px;
}

.presentation .text h1 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 22px;
    font-weight: 600;
    color: #FFF;
    line-height: 1.6;
    margin: 0;
    padding: 0;
}

.presentation .text p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: .8 !important;
    font-weight: 400;
    color: #FFF;
    line-height: 1.6;
    margin: 10px 0 20px 0;
    padding: 0;
    max-width: 550px;
}

.animation {
    display: flex;
    align-items: center;
    position: relative;
    transform: translateY(-15px);
}

.png, .svg { 
    position: relative; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-width: 100px; 
    min-height: 100px; 
}

.circle {
    width: 52px;
    height: 52px;
    display: table;
    background: #2450D6;
    border-radius: 900px;
    position: absolute;
    z-index: 0;
    animation: 3s balance ease infinite;
}

.png .circle {
    left: -8px;
    bottom: -7px;
    animation-delay: .3s;
}

.png .diamond {
    width: 7px;
    height: 7px;
    background: #F0C52B;
    display: table;
    transform: rotate(45deg);
    position: absolute;
    z-index: 3;
    top: 5px;
    left: 5px;
    animation: 3s balance ease infinite;
    animation-delay: 0s;
}
.png .diamond-2 {
    width: 4px;
    height: 4px;
    background: #F0C52B;
    display: table;
    transform: rotate(45deg);
    position: absolute;
    z-index: 3;
    bottom: 0;
    right: 0;
    animation: 3s balance ease infinite;
    animation-delay: .2s;
}
.png .dot {
    width: 5px;
    height: 5px;
    background: #FFF;
    display: table;
    border-radius: 900px;
    position: absolute;
    top: -10px;
    right: 20px;
    z-index: 3;
    animation: 3s balance ease infinite;
    animation-delay: .4s;
}
.png .dot-2 {
    width: 3px;
    height: 3px;
    background: #FFF;
    display: table;
    border-radius: 900px;
    position: absolute;
    bottom: 45px;
    left: 0px;
    z-index: 3;
    animation: 3s balance ease infinite;
    animation-delay: .6s;
}

.png-image, .svg-image {
    position: absolute;
    z-index: 1;
    display: table;
    animation: 3s balanceIn ease infinite;
}

.png-image { animation-delay: .4s; }

.svg .circle {
    right: -8px;
    top: -8px;
    animation-delay: .6s;
}

.svg .diamond {
    width: 7px;
    height: 7px;
    background: #F0C52B;
    display: table;
    transform: rotate(45deg);
    position: absolute;
    z-index: 3;
    top: 8px;
    left: 15px;
    animation: 3s balance ease infinite;
    animation-delay: 0s;
}
.svg .diamond-2 {
    width: 4px;
    height: 4px;
    background: #F0C52B;
    display: table;
    transform: rotate(45deg);
    position: absolute;
    z-index: 3;
    bottom: 10px;
    right: 0;
    animation: 3s balance ease infinite;
    animation-delay: .2s;
}
.svg .dot {
    width: 5px;
    height: 5px;
    background: #FFF;
    display: table;
    border-radius: 900px;
    position: absolute;
    top: -5px;
    right: 10px;
    z-index: 3;
    animation: 3s balance ease infinite;
    animation-delay: .4s;
}
.svg .dot-2 {
    width: 3px;
    height: 3px;
    background: #FFF;
    display: table;
    border-radius: 900px;
    position: absolute;
    bottom: 35px;
    left: -5px;
    z-index: 3;
    animation: 3s balance ease infinite;
    animation-delay: .6s;
}

@keyframes balance {
    0%, 100% { transform: translateY(0) rotate(45deg); }
    50% { transform: translateY(-15px) rotate(45deg); }
}
@keyframes balanceIn {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

.container { position: relative; }

.language-selector {
    position: absolute;
    right: 10px;
    bottom: -45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #FFF;
}

.language-type {
    background: rgba(36, 80, 214, .2);
    border: 1px solid #64A4EE;
    border-radius: 10px;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #FFF;
    z-index: 4;
    outline: none;
    transition: .3s ease all;
}

.language-selector {
    position: absolute;
    bottom: -2.5rem;
    right: 1rem;
    z-index: 2000;
}
.language-selector select {
    background: rgba(36, 80, 214, .2);
    border: 1px solid #64A4EE;
    border-radius: 10px;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #FFF;
    z-index: 4;
    outline: none;
    transition: .3s ease all;
    cursor: pointer;
}

.language-selector select option {
    border: 1px solid #ce58f8 !important;
    background: rgba(180, 18, 237, .1) !important;
    padding: 10px;
    min-height: 30px;
}

.label {
    font-size: .8rem;
    text-align: center;
    text-transform: uppercase;
    font-family: 'Open Sans', sans-serif;
    font-weight: 500;
    margin-top: 5px;
}

.tools {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    gap: 15px;
}

#inputFile { display: none; visibility: hidden; }
.upload-btn {
    padding: 15px 30px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 15px;
    background: #2450D6;
    color: #FFF;
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Open Sans', sans-serif;
    cursor: pointer;
    box-shadow: 2px 2px 20px rgba(21, 100, 219, .4);
    transition: .3s ease all;
}
.upload-btn i {
    font-size: 1.1rem;
    transform: translateY(-1px);
}

.upload-btn:hover {
    background: #2471d6;
}

.tools select {
    padding: 10px;
    border-radius: 15px;
    background: none;
    border: 1px solid #2450D6;
    color: #2450D6;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    outline: none;
}

.convert-label {
    color: #333;
    font-weight: 600;
    font-family: 'Open Sans', sans-serif;
    font-size: .9rem;
}

.preview-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
}

figure {
    width: 270px;
    height: 270px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #F7F7F7;
    border: 1px solid #C6C6C6;
    border-radius: 15px;
}
figure img {
    width: auto;
    height: 100%;
    display: table;
}

.info {
    max-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.info p {
    font-size: .9rem;
    color: #333;
    margin: 0;
    line-height: 1.6;
    font-weight: 500;
}
.info a {
    padding: 15px 30px;
    border-radius: 15px;
    background: #202840;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Open Sans', sans-serif;
    display: table;
    box-shadow: 2px 2px 10px rgba(21, 100, 219, .4);
    color: #FFF;
    text-transform: uppercase;
    text-align: center;
    max-width: 145px;
    transition: .3s ease all;
}
.info a:hover {
    background: #2450D6;
}

.project-presentation {
    display: flex;
    justify-content: space-between;
    column-gap: 30px;
    row-gap: 15px;
    flex-wrap: wrap;
    margin: 45px 0;
    width: 100%;
}

.supported-files h2 {
    display: inline-flex;
    align-items: center;
    column-gap: 7px;
    font-family: 'Open Sans', sans-serif;
    color: #202840;
    font-size: 22px;
    font-weight: 600; 
}

.supported-files p {
    color: #333;
    font-size: .9rem;
    line-height: 1.6;
}

.supported-files h2 i {
    font-size: 25px;
    color: #2450D6;
}

.data-security h2 {
    display: inline-flex;
    align-items: center;
    column-gap: 7px;
    font-family: 'Open Sans', sans-serif;
    color: #202840;
    font-size: 22px;
    font-weight: 600; 
}

.data-security p {
    color: #333;
    font-size: .9rem;
    line-height: 1.6;
}

.data-security h2 i {
    font-size: 25px;
    color: #2450D6;
}

.supported-files, .data-security {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border-radius: 15px;
    border: 1px solid #EAEAEA;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px auto;
}

footer p {
    display: flex;
    gap: 6px;
    align-items: center;
    color: #333;
    font-family: 'Open Sans', sans-serif;
    font-size: .9rem;
}

footer p a {
    color: #2450D6;
    font-weight: 600;
}

@media screen and (max-width: 800px) {
    header {
        min-height: 70vh;
    }
    .main-header {
        flex-direction: column;
        margin-top: 2rem;
    }
    .presentation {
        flex-direction: column;
        padding: 0 1.5rem;
    }
    .animation {
        margin-top: 3rem;
    }
    .shape {
        display: none;
    }
    .language-selector {
        bottom: -3rem;
    }
    .preview-container {
        flex-direction: column;
    }
    .tools {
        flex-wrap: wrap !important;
    }
}

@keyframes shine {
    0%, 100% { box-shadow: -1px -1px 10px rgba(43, 100, 246, .3); }
    50% { box-shadow: -1px -1px 30px rgba(43, 100, 246, .5); }
}

/*.appear {
    animation: appear linear;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
}
@keyframes appear {
    from {
        opacity: 0;
        transform: translateX(-100px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}*/

.btn-convert {
    padding: 15px;
    background: #202840;
    border-radius: 15px;
    font-family: 'Open Sans', sans-serif;
    font-size: .9rem;
    color: #FFF;
    border: none;
    outline: none;
    cursor: pointer;
}
</style>