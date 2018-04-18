require "minitest/autorun"
require_relative "./main"

class RubyProblemsTest < Minitest::Test

  def test_hello
    assert_equal "Hello World!", hello
    assert_equal "Hello Mike!", hello("Mike")
  end

  def test_area_of_circle
    assert_equal 50.26548245743669, area_of_circle(4)
    assert_equal 314.1592653589793, area_of_circle(10)
    assert_equal 3.141592653589793, area_of_circle(1)
  end

  def test_celcius_to_farenheit
    assert_equal 32, celcius_to_farenheit(0)
    assert_equal(-40, celcius_to_farenheit(-40))
    assert_equal 212, celcius_to_farenheit(100)
  end

  def test_number_reverse
    assert_equal 321, number_reverse(123)
    assert_equal 1004, number_reverse(4001)
    assert_equal 765.87, number_reverse(78.567)
  end

  def test_palindrome_check?
    assert palindrome_check?("pop")
    refute palindrome_check?("dog")
    assert palindrome_check?("nurses run")
    refute palindrome_check?("will not work")
  end

  def test_order_string_alphabetically
    assert_equal "ahppy", order_string_alphabetically("happy")
    assert_equal "bciloorsuy", order_string_alphabetically("ruby is cool")
    assert_equal "cegiknorsstt", order_string_alphabetically("Testing Rocks")
  end

  def test_num_of_occurances
    assert_equal({ t: 2, h: 1, i: 2, s: 2, g: 1, r: 1, e: 1, a: 1 }, num_of_occurances("this is great"))
    assert_equal({ f: 1, e: 3, l: 2, i: 2, n: 1, g: 1, k: 1, a: 1, p: 1, r: 1, o: 1 }, num_of_occurances("Feeling Like A Pro"))
  end

  def test_title_case
    assert_equal "This Is It", title_case("this is it")
  end

  def test_num_of_vowels
    assert_equal 6, num_of_vowels("yellow submarine")
    assert_equal 5, num_of_vowels("Aldgate East")
  end

  def test_remove_blank
    assert_equal([0, "Kevin"], remove_blank([0, nil, false, "", "Kevin"]))
    assert_equal([0,[],{}], remove_blank([0,[],{}]))
  end

  def test_random_element
    assert_includes ["red", "green", "blue"], random_element(["red", "green", "blue"])
  end

  def test_second_lowest_second_highest
    assert_equal([-93,99], second_lowest_second_highest([99,2000,-93,40,-761115,11]))
  end

  def test_coins
    assert_equal [100, 50], coins(1.50)
    assert_equal [100, 50, 20, 20, 5, 2, 2], coins(1.99)
    assert_equal [100, 100, 50, 20, 10, 5, 2, 1], coins(2.88)
  end

  def test_frame
    assert_equal "*******************\n* Rumplestiltskin *\n*******************", frame("Rumplestiltskin")
    assert_equal "***************\n* Hello Kitty *\n***************", frame("Hello Kitty")
  end

  def test_merge_unique
    assert_equal [1,2,3,4,5,6], merge_unique([1,2,3], [4,5,6])
    assert_equal ["Mike", "Emily", "Ajay", "Will"], merge_unique(["Mike", "Emily", "Ajay"], ["Ajay", "Will", "Emily"])
    assert_equal [5,10,15,20,30,40], merge_unique([5,10,15,20], [10,20,30,40])
  end

  def test_array_to_hashes
    assert_instance_of Array, array_to_hashes(["Paris", "New York"], "city")
    assert_equal 2, array_to_hashes(["Paris", "New York"], "city").size
    assert_equal "Paris", array_to_hashes(["Paris", "New York"], "city")[0][:city]
    assert_equal "New York", array_to_hashes(["Paris", "New York"], "city")[1][:city]
  end

  def test_hash_to_array
    assert_instance_of Array, hash_to_array({ name: "Will Smith", dob: "15-09-1968" })
    assert_equal 2, hash_to_array({ name: "Will Smith", dob: "15-09-1968" }).length
    assert_equal 2, hash_to_array({ name: "Will Smith", dob: "15-09-1968" })[0].length
    assert_equal 2, hash_to_array({ name: "Will Smith", dob: "15-09-1968" })[1].length
    assert_equal ["name", "Will Smith"], hash_to_array({ name: "Will Smith", dob: "15-09-1968" })[0]
    assert_equal ["dob", "15-09-1968"], hash_to_array({ name: "Will Smith", dob: "15-09-1968" })[1]
  end

  def test_days_between
    assert_equal 31, days_between("2017-02-01", "2017-01-01")
    assert_equal 31, days_between("2017-01-01", "2017-02-01")
  end

  def test_seconds_between
    assert_equal 1, seconds_between("12:00:00", "12:00:01")
    assert_equal 1, seconds_between("12:00:01", "12:00:00")
    assert_equal 1800, seconds_between("7:30:00pm", "8:00:00pm")
    assert_equal 1800, seconds_between("17:30:00", "18:00:00")
    assert_equal 1800, seconds_between("5:30:00pm", "18:00:00")
    ## TODO: Throw error if wrong format
  end

  def test_fibonacci
    assert_equal [0, 1, 1, 2, 3, 5, 8, 13], fibonacci(8)
    assert_equal [0], fibonacci(1)
    assert_equal [
      0,
      1,
      1,
      2,
      3,
      5,
      8,
      13,
      21,
      34,
      55,
      89,
      144,
      233,
      377,
      610,
      987,
      1597,
      2584,
      4181,
      6765,
      10_946,
      17_711,
      28_657,
      46_368,
      75_025,
      121_393,
      196_418,
      317_811,
      514_229,
      832_040,
      1_346_269,
      2_178_309,
      3_524_578,
      5_702_887,
      9_227_465,
      14_930_352,
      24_157_817,
      39_088_169,
      63_245_986,
      102_334_155,
      165_580_141,
      267_914_296,
      433_494_437,
      701_408_733,
      1_134_903_170,
      1_836_311_903,
      2_971_215_073,
      4_807_526_976,
      7_778_742_049
    ], fibonacci(50)
  end
end