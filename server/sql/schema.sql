
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  year_published VARCHAR(20) NULL,
  cover_image_url MEDIUMTEXT NULL,
  category VARCHAR(120) NULL,
  synopsis TEXT NULL,
  isbn VARCHAR(40) NULL,
  show_review_section TINYINT(1) NOT NULL DEFAULT 0,
  show_technical_details TINYINT(1) NOT NULL DEFAULT 0,
  show_purchase_links TINYINT(1) NOT NULL DEFAULT 0,
  publisher VARCHAR(180) NULL,
  page_count VARCHAR(40) NULL,
  technical_year VARCHAR(20) NULL,
  format VARCHAR(120) NULL,
  technical_details_extra TEXT NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_books_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS book_purchase_links (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  book_id BIGINT UNSIGNED NOT NULL,
  link_type ENUM('physical', 'ebook') NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_book_purchase_links (book_id, link_type),
  CONSTRAINT fk_book_purchase_links_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS book_quotes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  book_id BIGINT UNSIGNED NOT NULL,
  quote_text TEXT NOT NULL,
  quote_source VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_book_quotes_book_id (book_id),
  CONSTRAINT fk_book_quotes_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(180) NULL,
  published_at DATE NULL,
  display_date VARCHAR(120) NULL,
  excerpt TEXT NULL,
  content LONGTEXT NULL,
  category VARCHAR(120) NULL,
  tags_json JSON NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  image_url TEXT NULL,
  status ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NULL,
  alt_text VARCHAR(255) NULL,
  url TEXT NOT NULL,
  media_type ENUM('image', 'video', 'external') NOT NULL DEFAULT 'image',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  status ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  content_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cms_pages_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_sections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_key VARCHAR(120) NOT NULL,
  title VARCHAR(180) NOT NULL,
  content_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_sections_key (section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO books (
  slug, title, subtitle, year_published, cover_image_url, category, synopsis,
  show_review_section, show_technical_details, show_purchase_links, is_featured, status
)
VALUES (
  'a-historia-da-biblia', 'A História da Bíblia', 'Da Tradição Oral ao Cânon Sagrado', '2026', '/livro2.png', 'Religião',
  'Uma análise profunda sobre a formação dos textos sagrados.', 0, 1, 0, 1, 'published'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  year_published = VALUES(year_published),
  cover_image_url = VALUES(cover_image_url),
  category = VALUES(category),
  synopsis = VALUES(synopsis),
  show_review_section = VALUES(show_review_section),
  show_technical_details = VALUES(show_technical_details),
  show_purchase_links = VALUES(show_purchase_links),
  is_featured = VALUES(is_featured),
  status = VALUES(status);

INSERT INTO books (
  slug, title, subtitle, year_published, cover_image_url, category, synopsis,
  show_review_section, show_technical_details, show_purchase_links, is_featured, status
)
VALUES (
  'aparicoes-da-virgem-maria', 'Aparições da Virgem Maria', 'De Guadalupe a Medjugorje', '2024', '/livro1.png', 'Religião',
  'Estudo histórico e fenomenológico das mariologias contemporâneas.', 0, 0, 0, 1, 'published'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  year_published = VALUES(year_published),
  cover_image_url = VALUES(cover_image_url),
  category = VALUES(category),
  synopsis = VALUES(synopsis),
  show_review_section = VALUES(show_review_section),
  show_technical_details = VALUES(show_technical_details),
  show_purchase_links = VALUES(show_purchase_links),
  is_featured = VALUES(is_featured),
  status = VALUES(status);

INSERT INTO books (
  slug, title, subtitle, year_published, cover_image_url, category, synopsis,
  show_review_section, show_technical_details, show_purchase_links, is_featured, status
)
VALUES (
  'historia-das-religioes', 'História das Religiões', 'Judaísmo, Hinduísmo, Budismo, Cristianismo e Islamismo', '2024', '/livro3.png', 'Religião',
  'Um panorama das grandes tradições espirituais da humanidade.', 0, 0, 0, 1, 'published'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  year_published = VALUES(year_published),
  cover_image_url = VALUES(cover_image_url),
  category = VALUES(category),
  synopsis = VALUES(synopsis),
  show_review_section = VALUES(show_review_section),
  show_technical_details = VALUES(show_technical_details),
  show_purchase_links = VALUES(show_purchase_links),
  is_featured = VALUES(is_featured),
  status = VALUES(status);

INSERT INTO articles (slug, title, published_at, display_date, excerpt, content, category, status)
VALUES (
  'notas-sobre-a-historiografia-na-literatura-de-cordel',
  'Notas sobre a historiografia na literatura de cordel',
  '2026-03-12',
  '12 Março, 2026',
  'Uma breve análise sobre como a memória popular nordestina preservou fatos que a academia muitas vezes relegou às notas de rodapé.',
  'Conteúdo completo do artigo aqui...',
  'História',
  'published'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  published_at = VALUES(published_at),
  display_date = VALUES(display_date),
  excerpt = VALUES(excerpt),
  content = VALUES(content),
  category = VALUES(category),
  status = VALUES(status);

INSERT INTO articles (slug, title, published_at, display_date, excerpt, content, category, status)
VALUES (
  'o-processo-criativo-por-tras-de-a-historia-da-biblia',
  'O processo criativo por trás de A História da Bíblia',
  '2026-02-05',
  '05 Fevereiro, 2026',
  'Neste ensaio pessoal, discuto as motivações e os obstáculos de se escrever sobre tradição e cânon em um século de ruídos constantes.',
  'Conteúdo completo do artigo aqui...',
  'Bastidores',
  'published'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  published_at = VALUES(published_at),
  display_date = VALUES(display_date),
  excerpt = VALUES(excerpt),
  content = VALUES(content),
  category = VALUES(category),
  status = VALUES(status);

INSERT INTO media (title, alt_text, url, media_type)
SELECT 'Livro 1', 'Capa do livro 1', '/livro1.png', 'image'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = '/livro1.png');

INSERT INTO media (title, alt_text, url, media_type)
SELECT 'Livro 2', 'Capa do livro 2', '/livro2.png', 'image'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = '/livro2.png');

INSERT INTO media (title, alt_text, url, media_type)
SELECT 'Livro 3', 'Capa do livro 3', '/livro3.png', 'image'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = '/livro3.png');

INSERT INTO media (title, alt_text, url, media_type)
SELECT 'Autor', 'Retrato do autor', '/autor.jpg', 'image'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = '/autor.jpg');

INSERT INTO site_sections (section_key, title, content_json)
VALUES (
  'homeHero',
  'Hero da Home',
  JSON_OBJECT(
    'title', 'A palavra como instrumento de exploração do ser.',
    'subtitle', 'Ensaios acadêmicos, romances históricos e análises literárias que buscam compreender a complexidade da experiência humana através das eras.'
  )
)
ON DUPLICATE KEY UPDATE title = VALUES(title), content_json = VALUES(content_json);

INSERT INTO site_sections (section_key, title, content_json)
VALUES (
  'about',
  'Sobre o Autor',
  JSON_OBJECT(
    'trajetoria', 'Nascido em São Paulo em 1968, Nilton Célio da Silva Amaral desenvolveu desde cedo um fascínio particular pelas narrativas históricas.',
    'transicao', 'A publicação de sua obra conceitual, A História da Bíblia (2026), marcou uma inflexão em sua carreira editorial.'
  )
)
ON DUPLICATE KEY UPDATE title = VALUES(title), content_json = VALUES(content_json);

INSERT INTO site_sections (section_key, title, content_json)
VALUES (
  'contact',
  'Contato',
  JSON_OBJECT(
    'email', 'contato@niltonamaral.com.br',
    'phone', '+55 (11) 98765-4321',
    'address', 'São Paulo, SP - Brasil'
  )
)
ON DUPLICATE KEY UPDATE title = VALUES(title), content_json = VALUES(content_json);
