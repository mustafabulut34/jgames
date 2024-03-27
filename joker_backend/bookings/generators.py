import random
from datetime import datetime


def generate_booking_number():
    current_time = datetime.now()
    time_string = current_time.strftime("%Y%m%d%H%M%S")
    random_number = ''.join(random.choices('0123456789', k=4))
    booking_number = time_string + random_number
    return booking_number
