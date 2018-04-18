require 'date'

class Student

  attr_reader :classes, :name, :school, :enrollment_date, :graduation_date

  def initialize(name, school, enrollment_date)

    raise 'Invalid date' unless enrollment_date.is_a? Date

    @name = name
    @school = school
    @enrollment_date = enrollment_date
    @graduation_date = enrollment_date + (12*7)
    @classes = []
  end

  def join_class(class_name)
    @classes << class_name
  end

end

class Vehicle

  attr_accessor :owner, :color, :sale_price
  attr_reader :license_plate, :manufacture_date

  def initialize(license_plate, manufacture_date, color, sale_price)

    raise 'Invalid date' unless manufacture_date.is_a? Date

    @license_plate = license_plate
    @manufacture_date = manufacture_date
    @color = color
    @sale_price = sale_price
  end

end

class Car < Vehicle

  attr_reader :transmission

  WHEELS = 4

  def initialize(license_plate, manufacture_date, color, sale_price, transmission)
    super(license_plate, manufacture_date, color, sale_price)

    self.transmission=(transmission)
  end

  def transmission=(transmission)
    raise 'Invalid transmission' unless ['automatic', 'manual'].include? transmission
    @transmission = transmission
  end
end

class Motorbike < Vehicle

  WHEELS = 2

  def initialize(license_plate, manufacture_date, color, sale_price)
    super(license_plate, manufacture_date, color, sale_price)
  end
end

class Product

  attr_reader :sku
  attr_accessor :name, :origin, :color, :description, :image, :price

  def initialize(name, origin, color, description, sku, image, price)
    @name = name
    @origin = origin
    @color = color
    @description = description
    @sku = sku
    @image = image
    @price = price
  end
end

class Cart

  attr_reader :products

  def initialize
    @products = []
  end

  def add_to_cart(product)
    raise 'Invalid product' unless product.is_a? Product
    @products << product
  end

  def total
    @products.map(&:price).inject(:+)
  end
end


# STUDENT

student = Student.new "Mike Hayden", "General Assembly", Date.new(2017,5,8)
student.join_class("WDI")

p student


# CAR

car = Car.new "BD51 SMR", Date.new(1999,10,10), "Aqua", 1250, "manual"
car.transmission = "automatic"
car.owner = "Mike Hayden"
p car


# PRODUCT

toothbrush = Product.new "Oral B Pro2000 3D", "United States of America", "White", "Electric toothbrush", "632212", "http://www.superdrug.com/medias/sys_master/front/zoom/8994754592798.jpg", 69.99
p toothbrush

gopro = Product.new "GoPro HERO Action Cam", "United States of America", "Black", "Micro video camer", "418/4063", "http://media.4rgos.it/i/Argos/4184063_R_Z002A?$Web$&w=1240&h=1116", 159
p gopro


# CART

cart = Cart.new
cart.add_to_cart(toothbrush)
cart.add_to_cart(gopro)

p cart.total
