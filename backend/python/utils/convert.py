from fractions import Fraction

def convert_quantity_to_float(quantity_str):
    # Split the quantity string by spaces
    parts = quantity_str.split()
    
    # Assume the first part is the numerical value
    numerical_part = parts[0]
    
    # Convert the numerical part to float
    try:
        # Handle cases like '1/3'
        if '/' in numerical_part:
            value = float(Fraction(numerical_part))
        else:
            value = float(numerical_part)
    except ValueError:
        raise ValueError(f"Unable to convert quantity '{quantity_str}' to float.")
    
    return value