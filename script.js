document.addEventListener('DOMContentLoaded', function() {
    // Color Mixer Variables
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const colorValue1 = document.getElementById('colorValue1');
    const colorValue2 = document.getElementById('colorValue2');
    const selectedColor1 = document.getElementById('selectedColor1');
    const selectedColor2 = document.getElementById('selectedColor2');
    const mixButton = document.getElementById('mixButton');
    const resultColor = document.getElementById('resultColor');
    const colorCode = document.getElementById('colorCode');
    const colorHistoryContainer = document.getElementById('colorHistory');
    const converterColorInput = document.getElementById('converterColor');
    const converterColorValue = document.getElementById('converterColorValue');
    const targetFormatSelect = document.getElementById('targetFormat');
    const convertButton = document.getElementById('convertButton');
    const convertedColor = document.getElementById('convertedColor');
    const convertedCode = document.getElementById('convertedCode');
    
    // Palette Generator Variables
    const baseColorInput = document.getElementById('baseColor');
    const baseColorValue = document.getElementById('baseColorValue');
    const harmonyButtons = document.querySelectorAll('.harmony-button');
    const paletteDisplay = document.getElementById('paletteDisplay');
    
    let colorHistory = [];
    let currentHarmonyType = 'analogous';

    // Initialize the app
    function init() {
        color1Input.value = '#ff0000';
        color2Input.value = '#00ff00';
        converterColorInput.value = '#3a7bd5';
        updateConverterColor();
        updateSelectedColor(1);
        updateSelectedColor(2);
        generatePalette();

        // Event listeners for Color Converter
        converterColorInput.addEventListener('input', updateConverterColor);
        convertButton.addEventListener('click', convertColor);
        
        // Event listeners for Color Mixer
        color1Input.addEventListener('input', () => updateSelectedColor(1));
        color2Input.addEventListener('input', () => updateSelectedColor(2));
        mixButton.addEventListener('click', mixColors);
        
        // Event listeners for Palette Generator
        baseColorInput.addEventListener('input', generatePalette);
        
        harmonyButtons.forEach(button => {
            button.addEventListener('click', function() {
                setHarmonyType(this.dataset.type);
            });
        });
    }

    // Color Mixer Functions
    function updateSelectedColor(colorNum) {
        const color = document.getElementById(`color${colorNum}`).value;
        const selectedColor = document.getElementById(`selectedColor${colorNum}`);
        const colorValue = document.getElementById(`colorValue${colorNum}`);
        
        selectedColor.style.backgroundColor = color;
        colorValue.textContent = color.toUpperCase();
        
        selectedColor.classList.add('color-change-animation');
        setTimeout(() => {
            selectedColor.classList.remove('color-change-animation');
        }, 500);
    }

    function mixColors() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;

        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        const mixedRgb = {
            r: Math.round((rgb1.r + rgb2.r) / 2),
            g: Math.round((rgb1.g + rgb2.g) / 2),
            b: Math.round((rgb1.b + rgb2.b) / 2)
        };

        const mixedColor = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
        
        resultColor.style.backgroundColor = mixedColor;
        resultColor.classList.add('color-change-animation');
        
        setTimeout(() => {
            resultColor.classList.remove('color-change-animation');
        }, 500);

        colorCode.textContent = mixedColor.toUpperCase();
        addToHistory(mixedColor);

        // Update Palette Generator with the mixed color
        baseColorInput.value = mixedColor;
        baseColorValue.textContent = mixedColor.toUpperCase();
        generatePalette();

        // Update Color Converter with the mixed color
        converterColorInput.value = mixedColor;
        converterColorValue.textContent = mixedColor.toUpperCase();
        convertedColor.style.backgroundColor = mixedColor;
        convertColor();
    }

    function addToHistory(color) {
        if (!colorHistory.includes(color)) {
            colorHistory.unshift(color);
            if (colorHistory.length > 10) colorHistory.pop();
            updateHistoryDisplay();
        }
    }

    function updateHistoryDisplay() {
        colorHistoryContainer.innerHTML = '';
        
        colorHistory.forEach(color => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.backgroundColor = color;
            historyItem.title = color;
            historyItem.addEventListener('click', () => {
                resultColor.style.backgroundColor = color;
                colorCode.textContent = color.toUpperCase();
                
                // Also update Palette Generator and Color Converter when clicking history items
                baseColorInput.value = color;
                baseColorValue.textContent = color.toUpperCase();
                converterColorInput.value = color;
                converterColorValue.textContent = color.toUpperCase();
                convertedColor.style.backgroundColor = color;
                generatePalette();
                convertColor();
            });
            colorHistoryContainer.appendChild(historyItem);
        });
    }

    // Palette Generator Functions
    function setHarmonyType(type) {
        currentHarmonyType = type;
        harmonyButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        generatePalette();
    }

    function generatePalette() {
        const baseColor = baseColorInput.value;
        baseColorValue.textContent = baseColor.toUpperCase();
        
        let paletteColors = [];
        
        switch(currentHarmonyType) {
            case 'analogous':
                paletteColors = generateAnalogousColors(baseColor);
                break;
            case 'complementary':
                paletteColors = generateComplementaryColors(baseColor);
                break;
            case 'triadic':
                paletteColors = generateTriadicColors(baseColor);
                break;
            case 'splitComplementary':
                paletteColors = generateSplitComplementaryColors(baseColor);
                break;
            case 'random':
                paletteColors = generateRandomHarmonyColors(baseColor);
                break;
            default:
                paletteColors = generateAnalogousColors(baseColor);
        }
        
        displayPalette(paletteColors);
    }

    function generateAnalogousColors(baseColor) {
        const baseHsl = hexToHsl(baseColor);
        const colors = [baseColor];
        
        for (let i = 1; i <= 2; i++) {
            colors.push(hslToHex((baseHsl.h + 30 * i) % 360, baseHsl.s, baseHsl.l));
            colors.unshift(hslToHex((baseHsl.h - 30 * i + 360) % 360, baseHsl.s, baseHsl.l));
        }
        
        return colors.slice(0, 5);
    }

    function generateComplementaryColors(baseColor) {
        const baseHsl = hexToHsl(baseColor);
        const complementaryHue = (baseHsl.h + 180) % 360;
        
        return [
            baseColor,
            hslToHex(complementaryHue, baseHsl.s, baseHsl.l),
            hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 100)),
            hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 0)),
            hslToHex(complementaryHue, Math.min(baseHsl.s + 20, 100), baseHsl.l)
        ];
    }

    function generateTriadicColors(baseColor) {
        const baseHsl = hexToHsl(baseColor);
        const triadic1 = (baseHsl.h + 120) % 360;
        const triadic2 = (baseHsl.h + 240) % 360;
        
        return [
            baseColor,
            hslToHex(triadic1, baseHsl.s, baseHsl.l),
            hslToHex(triadic2, baseHsl.s, baseHsl.l),
            hslToHex(baseHsl.h, Math.min(baseHsl.s + 20, 100), baseHsl.l),
            hslToHex(triadic1, baseHsl.s, Math.max(baseHsl.l - 15, 0))
        ];
    }

    function generateSplitComplementaryColors(baseColor) {
        const baseHsl = hexToHsl(baseColor);
        const complementaryHue = (baseHsl.h + 180) % 360;
        const split1 = (complementaryHue - 30 + 360) % 360;
        const split2 = (complementaryHue + 30) % 360;
        
        return [
            baseColor,
            hslToHex(split1, baseHsl.s, baseHsl.l),
            hslToHex(split2, baseHsl.s, baseHsl.l),
            hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 100)),
            hslToHex((baseHsl.h + 15) % 360, baseHsl.s, baseHsl.l)
        ];
    }

    function generateRandomHarmonyColors(baseColor) {
        const baseHsl = hexToHsl(baseColor);
        const colors = [baseColor];
        
        for (let i = 0; i < 4; i++) {
            const randomHue = Math.floor(Math.random() * 360);
            const randomSat = Math.min(Math.max(baseHsl.s + Math.floor(Math.random() * 40) - 20, 10), 100);
            const randomLight = Math.min(Math.max(baseHsl.l + Math.floor(Math.random() * 40) - 20, 10), 90);
            
            colors.push(hslToHex(randomHue, randomSat, randomLight));
        }
        
        return colors;
    }

    function displayPalette(colors) {
        paletteDisplay.innerHTML = '';
        
        colors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'palette-color';
            colorElement.style.backgroundColor = color;
            colorElement.textContent = color.toUpperCase();
            colorElement.addEventListener('click', () => {
                baseColorInput.value = color;
                baseColorValue.textContent = color.toUpperCase();
                generatePalette();
                
                // Also update Color Mixer and Converter when clicking palette colors
                resultColor.style.backgroundColor = color;
                colorCode.textContent = color.toUpperCase();
                converterColorInput.value = color;
                converterColorValue.textContent = color.toUpperCase();
                convertedColor.style.backgroundColor = color;
                convertColor();
            });
            paletteDisplay.appendChild(colorElement);
        });
    }

    // Color Converter Functions
    function updateConverterColor() {
        const color = converterColorInput.value;
        converterColorValue.textContent = color.toUpperCase();
        convertedColor.style.backgroundColor = color;
    }

    function convertColor() {
        const color = converterColorInput.value;
        const targetFormat = targetFormatSelect.value;
        
        let result;
        
        switch(targetFormat) {
            case 'hex':
                result = color.toUpperCase();
                break;
            case 'rgb':
                const rgb = hexToRgb(color);
                result = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                break;
            case 'hsl':
                const hsl = hexToHsl(color);
                result = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                break;
            case 'cmyk':
                const cmyk = hexToCmyk(color);
                result = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
                break;
            default:
                result = color.toUpperCase();
        }
        
        convertedCode.textContent = result;
        convertedColor.classList.add('color-change-animation');
        setTimeout(() => {
            convertedColor.classList.remove('color-change-animation');
        }, 500);
    }

    function hexToCmyk(hex) {
        const rgb = hexToRgb(hex);
        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;
        
        let k = 1 - Math.max(r, g, b);
        let c = (1 - r - k) / (1 - k);
        let m = (1 - g - k) / (1 - k);
        let y = (1 - b - k) / (1 - k);
        
        c = isNaN(c) ? 0 : c;
        m = isNaN(m) ? 0 : m;
        y = isNaN(y) ? 0 : y;
        
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Utility Functions
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToHsl(hex) {
        const rgb = hexToRgb(hex);
        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;
        
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Start the application
    init();
});