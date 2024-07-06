// seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	// Define sizes and ingredients
	const sizes = [
		{ size_name: 'Small', price: 0.0 },
		{ size_name: 'Medium', price: 2.0 },
		{ size_name: 'Large', price: 4.0 },
	];

	const ingredients = [
		{ ingredient_name: 'Pepperoni', price_adjustment: 1.5 },
		{ ingredient_name: 'Mushrooms', price_adjustment: 1.0 },
		{ ingredient_name: 'Extra Cheese', price_adjustment: 2.0 },
	];

	// Create sizes and ingredients in the database
	const createdSizes = await Promise.all(
		sizes.map((size) =>
			prisma.pizzaSize.create({
				data: size,
			}),
		),
	);

	const createdIngredients = await Promise.all(
		ingredients.map((ingredient) =>
			prisma.pizzaIngredient.create({
				data: ingredient,
			}),
		),
	);

	// Define pizzas with their base prices
	const pizzas = [
		{ pizza_name: 'Маргарита', base_price: 8.0 },
		{ pizza_name: 'Пепперони', base_price: 10.0 },
		{ pizza_name: 'Вегетарианская', base_price: 9.0 },
		// Add more pizzas as needed
	];

	// Create pizzas in the database
	const createdPizzas = await Promise.all(
		pizzas.map((pizza) =>
			prisma.pizza.create({
				data: pizza,
			}),
		),
	);

	// Define pizza options (sizes and ingredients combinations)
	const pizzaOptions = [
		{ pizza_id: createdPizzas[0].pizza_id, size_id: createdSizes[0].size_id }, // Margherita, Small
		{ pizza_id: createdPizzas[0].pizza_id, size_id: createdSizes[1].size_id }, // Margherita, Medium
		{ pizza_id: createdPizzas[0].pizza_id, size_id: createdSizes[2].size_id }, // Margherita, Large

		{
			pizza_id: createdPizzas[1].pizza_id,
			size_id: createdSizes[0].size_id,
			ingredient_id: createdIngredients[0].ingredient_id,
		}, // Pepperoni Feast, Small with Pepperoni
		{
			pizza_id: createdPizzas[1].pizza_id,
			size_id: createdSizes[1].size_id,
			ingredient_id: createdIngredients[0].ingredient_id,
		}, // Pepperoni Feast, Medium with Pepperoni
		{
			pizza_id: createdPizzas[1].pizza_id,
			size_id: createdSizes[2].size_id,
			ingredient_id: createdIngredients[0].ingredient_id,
		}, // Pepperoni Feast, Large with Pepperoni

		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[0].size_id,
			ingredient_id: createdIngredients[1].ingredient_id,
		}, // Vegetarian, Small with Mushrooms
		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[1].size_id,
			ingredient_id: createdIngredients[1].ingredient_id,
		}, // Vegetarian, Medium with Mushrooms
		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[2].size_id,
			ingredient_id: createdIngredients[1].ingredient_id,
		}, // Vegetarian, Large with Mushrooms

		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[0].size_id,
			ingredient_id: createdIngredients[2].ingredient_id,
		}, // Vegetarian, Small with Extra Cheese
		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[1].size_id,
			ingredient_id: createdIngredients[2].ingredient_id,
		}, // Vegetarian, Medium with Extra Cheese
		{
			pizza_id: createdPizzas[2].pizza_id,
			size_id: createdSizes[2].size_id,
			ingredient_id: createdIngredients[2].ingredient_id,
		}, // Vegetarian, Large with Extra Cheese
	];

	// Create pizza options in the database
	await Promise.all(
		pizzaOptions.map((option) =>
			prisma.pizzaOption.create({
				data: option,
			}),
		),
	);

	console.log('Seed data inserted successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
