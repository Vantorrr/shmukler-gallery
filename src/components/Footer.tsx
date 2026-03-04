import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full bg-white pt-24 pb-12 px-6 md:px-12 border-t border-gray-100 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Newsletter */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Рассылка</h4>
          <form className="flex flex-col gap-4 max-w-sm">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
            />
            <button className="text-xs uppercase tracking-[0.2em] text-left hover:opacity-50 transition-opacity self-start">
              Подписаться
            </button>
          </form>
        </div>

        {/* Gallery Info */}
        <div className="md:col-span-3 md:col-start-6 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Галерея</h4>
          <div className="space-y-4 text-sm font-light leading-relaxed text-gray-600">
            <p>
              Новослободская 45Б<br />
              Москва
            </p>
            <p>
              <a href="mailto:info@shmuklergallery.com" className="hover:text-black transition-colors">info@shmuklergallery.com</a><br />
              <a href="tel:+79990000000" className="hover:text-black transition-colors">+7 (999) 000-00-00</a>
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Меню</h4>
          <ul className="space-y-3 text-sm font-light text-gray-600">
            <li><Link href="/artists" className="hover:text-black transition-colors">Художники</Link></li>
            <li><Link href="/exhibitions" className="hover:text-black transition-colors">Выставки</Link></li>
            <li><Link href="/viewing-rooms" className="hover:text-black transition-colors">Просмотровые залы</Link></li>
            <li><Link href="/about" className="hover:text-black transition-colors">О нас</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">Контакты</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Соцсети</h4>
          <ul className="space-y-3 text-sm font-light text-gray-600">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Facebook</a></li>
            <li><a href="https://artsy.net" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Artsy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-24 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase tracking-widest text-gray-400 gap-4">
        <p>&copy; {new Date().getFullYear()} Shmukler Gallery</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-black transition-colors">Политика конфиденциальности</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Условия использования</Link>
        </div>
      </div>
    </footer>
  )
}
