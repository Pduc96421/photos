const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^[A-Za-z\d@$!%*?&]{6,}$/;

//   (?=.*[A-Z]): ít nhất 1 chữ hoa
// (?=.*\d): ít nhất 1 chữ số
// (?=.*[@$!%*?&]): ít nhất 1 ký tự đặc biệt
// {6,}: tối thiểu 6 ký tự

const validateInput = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập tên đăng nhập và mật khẩu",
    });
    return;
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      code: 400,
      message:
        "Tên đăng nhập phải từ 3-20 ký tự và không chứa ký tự đặc biệt (chỉ cho phép chữ, số và dấu gạch dưới).",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      code: 400,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  }
  next();
};

module.exports.login = validateInput;
module.exports.register = validateInput;
