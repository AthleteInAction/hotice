class SessionsController < ApplicationController

	# skip_before_filter :authenticate

	# GET
	# ======================================================
	# ======================================================
	def index



	end
	# ======================================================
	# ======================================================

	# POST
	# ======================================================
	# ======================================================
	def create



	end
	# ======================================================
	# ======================================================

	# DELETE
	# ======================================================
	# ======================================================
	def destroy

		session.delete :user

		redirect_to root_url

	end
	# ======================================================
	# ======================================================

end