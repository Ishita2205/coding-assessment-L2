console.log('====================================');
console.log("Connected");
console.log('====================================');

document.addEventListener('DOMContentLoaded', () => {
    fetchProductData();
});

function fetchProductData() {
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448')
        .then(response => response.json())
        .then(data => {
            if (data.product) {
                populateProductDetails(data.product);
            } else {
                console.error('Product data is not in the expected format:', data);
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}

function populateProductDetails(product) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = "https://images.unsplash.com/photo-1565462905097-5e701c31dcfb?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";  // Make sure this URL points to your actual image
    mainImage.alt = "Product Image";

    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = `
        <img src="https://images.unsplash.com/photo-1565462905097-5e701c31dcfb?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Thumbnail 1" onclick="changeImage('https://images.unsplash.com/photo-1565462905097-5e701c31dcfb?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
        <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Thumbnail 2" onclick="changeImage('https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
        <img src="https://images.unsplash.com/photo-1586702943770-a591b49a472c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Thumbnail 3" onclick="changeImage('https://images.unsplash.com/photo-1586702943770-a591b49a472c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
        <img src="https://images.unsplash.com/photo-1640660171153-4c2a5e80039d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Thumbnail 4" onclick="changeImage('https://images.unsplash.com/photo-1640660171153-4c2a5e80039d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
    `;

    document.getElementById('vendor').innerText = product.vendor;
    document.getElementById('title').innerText = product.title;
    document.getElementById('price').innerText = formatPrice(product.price);
    const compareAtPriceElement = document.getElementById('compare-at-price');
    compareAtPriceElement.innerHTML = `<del>${formatPrice(product.compare_at_price)}</del>`;

    const discount = Math.round((parseFloat(product.compare_at_price.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.compare_at_price.replace('$', '')) * 100);
    document.getElementById('discount').innerText = `${discount}% Off`;
    document.getElementById('description').innerHTML = product.description;

    const colorOptionsContainer = document.getElementById('colorOptions');
    if (colorOptionsContainer) {
        colorOptionsContainer.innerHTML = '';
        product.options[0].values.forEach(colorObj => {
            const color = Object.keys(colorObj)[0];
            const colorHex = colorObj[color];
            
            const colorLabel = document.createElement('label');
            colorLabel.style.backgroundColor = colorHex;
            colorLabel.classList.add('color-option');

            const colorRadioButton = document.createElement('input');
            colorRadioButton.type = 'radio';
            colorRadioButton.name = 'color';
            colorRadioButton.value = color;
            colorRadioButton.onclick = () => toggleTickMark(colorLabel);

            colorLabel.appendChild(colorRadioButton);
            colorOptionsContainer.appendChild(colorLabel);
        });
    }

    const sizeOptionsContainer = document.getElementById('sizeOptions');
    if (sizeOptionsContainer) {
        sizeOptionsContainer.innerHTML = '';
        product.options[1].values.forEach(size => {
            const optionLabel = document.createElement('label');
            optionLabel.innerText = size;

            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = 'size';
            radioButton.value = size;

            optionLabel.appendChild(radioButton);
            sizeOptionsContainer.appendChild(optionLabel);
        });
    }
}

function changeImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
    }
}

function formatPrice(price) {
    return `$${parseFloat(price.replace('$', '')).toFixed(2)}`;
}

function calculateDiscount(compareAtPrice, price) {
    const compareAt = parseFloat(compareAtPrice.replace('$', ''));
    const currentPrice = parseFloat(price.replace('$', ''));
    if (compareAt > 0) {
        return Math.round((compareAt - currentPrice) / compareAt * 100);
    }
    return 0;
}

function toggleTickMark(colorLabel) {
    const allColorLabels = document.querySelectorAll('.color-option');
    allColorLabels.forEach(label => {
        label.classList.remove('selected');
    });
    colorLabel.classList.add('selected');
}

function changeQuantity(amount) {
    const input = document.getElementById('quantity');
    if (input) {
        const currentQuantity = parseInt(input.value);
        if (currentQuantity + amount > 0) {
            input.value = currentQuantity + amount;
        }
    }
}

function addToCart() {
    const quantity = document.getElementById('quantity').value;

    const colorInputs = document.querySelectorAll('input[name="color"]');
    let selectedColor = 'None';
    colorInputs.forEach(input => {
        if (input.checked) {
            selectedColor = input.value;
        }
    });

    const sizeInputs = document.querySelectorAll('input[name="size"]');
    let selectedSize = 'Not selected';
    sizeInputs.forEach(input => {
        if (input.checked) {
            selectedSize = input.value;
        }
    });

    const message = `Added to cart: ${quantity} item(s), Color: ${selectedColor}, Size: ${selectedSize}`;

    const cartMessage = document.getElementById('cart-message');
    cartMessage.textContent = message;
    cartMessage.classList.add('show-message');

    setTimeout(() => {
        cartMessage.textContent = '';
        cartMessage.classList.remove('show-message');
    }, 5000);
}

