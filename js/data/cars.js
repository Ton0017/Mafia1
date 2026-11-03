const CarsData = {
  showrooms: {
    ford: {
      name: 'Ford',
      desc: 'Американская классика. Дешево, сердито, ржаво.',
      cars: [
        { id: 'ford_pinto',      name: 'Ford Pinto',       year: 1971, price: 800,   desc: 'Взрывается при столкновении. Буквально.' },
        { id: 'ford_mustang',    name: 'Ford Mustang',     year: 1969, price: 3500,  desc: 'Легенда. Каждый коп мечтает её остановить.' },
        { id: 'ford_thunderbird',name: 'Ford Thunderbird', year: 1985, price: 5500,  desc: 'Тяжелая, как твои мысли после запоя.' }
      ]
    },
    chevrolet: {
      name: 'Chevrolet',
      desc: 'Для тех, кто хочет показать, что у него есть деньги. Или их имитировать.',
      cars: [
        { id: 'chevy_vega',    name: 'Chevrolet Vega',  year: 1972, price: 900,   desc: 'Ржавеет быстрее, чем ты успеваешь заправить.' },
        { id: 'chevy_camaro',  name: 'Chevrolet Camaro',year: 1978, price: 4200,  desc: 'Рычит как зверь. Едет как зверь. Жрет как зверь.' },
        { id: 'chevy_corvette',name: 'Chevrolet Corvette', year: 1984, price: 12000, desc: 'Ты не гангстер. Ты звезда. Ну, почти.' }
      ]
    },
    dodge: {
      name: 'Dodge',
      desc: 'Шумные, быстрые, опасные. Как и ты.',
      cars: [
        { id: 'dodge_dart',     name: 'Dodge Dart',      year: 1970, price: 1200, desc: 'Неубиваемая. Как таракан.' },
        { id: 'dodge_charger',  name: 'Dodge Charger',   year: 1969, price: 6000, desc: 'На такой ездят только плохие парни.' },
        { id: 'dodge_viper',    name: 'Dodge Viper',     year: 1992, price: 18000, desc: 'Самая злая тачка в городе. Не для новичков.' }
      ]
    },
    cadillac: {
      name: 'Cadillac',
      desc: 'Для Донов. Для тех, кто уже на вершине.',
      cars: [
        { id: 'cadillac_eldorado',  name: 'Cadillac Eldorado',  year: 1975, price: 8000,  desc: 'Роскошь на колесах. Копы даже не смотрят.' },
        { id: 'cadillac_seville',   name: 'Cadillac Seville',   year: 1980, price: 11000, desc: 'Статус. Чистый, концентрированный статус.' },
        { id: 'cadillac_fleetwood', name: 'Cadillac Fleetwood', year: 1990, price: 22000, desc: 'На такой ездят те, кто уже ничего не боится.' }
      ]
    },
    lincoln: {
      name: 'Lincoln',
      desc: 'Машины для политиков, юристов и тех, кто их покупает.',
      cars: [
        { id: 'lincoln_continental', name: 'Lincoln Continental', year: 1972, price: 7000,  desc: 'В багажник влезает больше, чем ты думаешь.' },
        { id: 'lincoln_markv',       name: 'Lincoln Mark V',      year: 1978, price: 10000, desc: 'Скрытые фары, скрытые намерения.' },
        { id: 'lincoln_towncar',     name: 'Lincoln Town Car',    year: 1990, price: 14000, desc: 'Ты выглядишь как адвокат. Или как труп адвоката.' }
      ]
    },
    pontiac: {
      name: 'Pontiac',
      desc: 'Машины для тех, кто любит, чтобы на них смотрели.',
      cars: [
        { id: 'pontiac_firebird', name: 'Pontiac Firebird', year: 1977, price: 5500, desc: 'Птица-огонь. Не бойся, если она загорится.' },
        { id: 'pontiac_transam',  name: 'Pontiac Trans Am', year: 1981, price: 8500, desc: 'Культовая тачка 80-х. Летит как самолет.' },
        { id: 'pontiac_gto',      name: 'Pontiac GTO',      year: 1969, price: 12000,desc: 'Мышцы на колесах. Без фильтров.' }
      ]
    },
    chrysler: {
      name: 'Chrysler',
      desc: 'Для тех, кто хочет, чтобы к нему уважительно обращались.',
      cars: [
        { id: 'chrysler_newport', name: 'Chrysler Newport', year: 1970, price: 4000, desc: 'Огромная, удобная. Как диван на колесах.' },
        { id: 'chrysler_newyorker', name: 'Chrysler New Yorker', year: 1978, price: 6500, desc: 'Нью-Йорк? Нет, ты в Ноктауне. Но выглядит так же дорого.' },
        { id: 'chrysler_imperial',name: 'Chrysler Imperial',year: 1990, price: 15000, desc: 'Имперский размер. Не для скромных.' }
      ]
    },
    buick: {
      name: 'Buick',
      desc: 'Машины для тех, кто уже "устроился в жизни".',
      cars: [
        { id: 'buick_skylark', name: 'Buick Skylark', year: 1972, price: 2000, desc: 'Никто не скажет, что у тебя плохой вкус. Но и хорошего не заметят.' },
        { id: 'buick_riviera', name: 'Buick Riviera', year: 1978, price: 7000, desc: 'Стильная штука. Не для каждого.' },
        { id: 'buick_regal',   name: 'Buick Regal',   year: 1986, price: 9500, desc: 'Королевский. Как и ты.' }
      ]
    },
    oldsmobile: {
      name: 'Oldsmobile',
      desc: 'Старая школа. Но не значит плохая.',
      cars: [
        { id: 'olds_cutlass', name: 'Oldsmobile Cutlass', year: 1975, price: 3000, desc: 'Рабочая лошадка. Ездит и не задает вопросов.' },
        { id: 'olds_442',     name: 'Oldsmobile 442',     year: 1969, price: 9000, desc: 'Настоящая классика. Не всем хватает денег и ума.' },
        { id: 'olds_toronado',name: 'Oldsmobile Toronado',year: 1985, price: 11000,desc: 'Передний привод, задний удар. Уникальна.' }
      ]
    },
    plymouth: {
      name: 'Plymouth',
      desc: 'Дешевые тачки для настоящих гангстеров.',
      cars: [
        { id: 'plymouth_fury',   name: 'Plymouth Fury',   year: 1965, price: 1500, desc: 'Старая, страшная. Но в хорошем смысле.' },
        { id: 'plymouth_cuda',   name: 'Plymouth Barracuda', year: 1970, price: 8000, desc: 'Редкая. Дорогая. Опасная.' },
        { id: 'plymouth_roadrunner', name: 'Plymouth Road Runner', year: 1973, price: 5000, desc: 'Бип-бип. Убегай.' }
      ]
    }
  },

  getAllCars() {
    const cars = [];
    for (const [showroomId, showroom] of Object.entries(this.showrooms)) {
      for (const car of showroom.cars) {
        cars.push({ ...car, showroomId, showroomName: showroom.name });
      }
    }
    return cars;
  },

  find(carId) {
    for (const showroom of Object.values(this.showrooms)) {
      const car = showroom.cars.find(c => c.id === carId);
      if (car) return car;
    }
    return null;
  }
};
