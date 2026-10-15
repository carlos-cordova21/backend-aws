import bcrypt from 'bcryptjs';

export class AuthUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async login(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    return { token, user: { username: user.username, role: user.role } };
  }
}